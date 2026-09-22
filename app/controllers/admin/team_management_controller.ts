import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Team from '#models/team'
import Role from '#models/role'
import { inviteAdminValidator } from '#validators/admin_management_validator'
import { createTeamValidator, updateTeamValidator } from '#validators/team_management_validator'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import { logAudit } from '#services/audit_service'

export default class TeamManagementController {
  /**
   * 1. Invite a new admin/staff user to a specific team
   */
 async invite(ctx: HttpContext) {
  const { request, response } = ctx

  try {
    // 1. Validate payload including teamId and roleId
    const payload = await request.validateUsing(inviteAdminValidator)

    // 2. Ensure target team exists
    const team = await Team.find(payload.teamId)
    if (!team) {
      return response.notFound({
        errors: [{ message: 'Target team does not exist.' }],
      })
    }

    // 3. Ensure target role exists, belongs to the selected team, and is active
    const role = await Role.query()
      .where('id', payload.roleId)
      .where('teamId', payload.teamId)
      .first()

    if (!role) {
      return response.badRequest({
        errors: [{ message: 'Selected role does not exist or does not belong to the specified team.' }],
      })
    }

    if (role.status === 'inactive') {
      return response.badRequest({
        errors: [{ message: 'Cannot assign a deactivated role to a user.' }],
      })
    }

    // 4. Generate secure OTP token
    const otpToken = crypto.randomBytes(32).toString('hex')
    const tokenSentAt = DateTime.now()

    // 5. Create admin user with assigned teamId and roleId
    const adminUser = await User.create({
      email: payload.email,
      teamId: team.id,
      roleId: role.id,
      role: 'team',
      accountType: 'admin',
      password: 'not_set',
      status: 'pending',
      isEmailVerified: false,
      otpToken: otpToken,
      otpTokenSentAt: tokenSentAt,
    })

    // 6. Construct invite URL and send email
    const baseUrl = process.env.ADMIN_PORTAL_URL || '#'
    const inviteUrl = `${baseUrl}/accept-invitation?token=${otpToken}&email=${encodeURIComponent(adminUser.email)}`

    try {
      await mail.send((message) => {
        message
          .to(adminUser.email)
          .subject('You have been invited to join MoneyLot Admin Portal')
          .htmlView('emails/admin_invitation', {
            user: adminUser,
            teamName: team.name,
            roleName: role.name,
            otpToken: otpToken,
            inviteUrl: inviteUrl,
          })
      })
    } catch (mailError: any) {
      logger.error(
        { err: mailError, userId: adminUser.id },
        'Admin user record created, but invitation email failed to send.'
      )
    }

    // 7. Record Audit Log with team and role context
    await logAudit(ctx, {
      action: 'INVITE_ADMIN_USER',
      entity: 'users',
      entityId: adminUser.id,
      oldValues: null,
      newValues: {
        email: adminUser.email,
        teamId: adminUser.teamId,
        teamName: team.name,
        roleId: role.id,
        roleName: role.name,
        accountType: adminUser.accountType,
        status: adminUser.status,
      },
    })

    // 8. Return success response
    return response.created({
      success: true,
      message: `Admin user invited successfully to ${team.name} as ${role.name}.`,
      data: {
        id: adminUser.id,
        email: adminUser.email,
        team: {
          id: team.id,
          name: team.name,
        },
        role: {
          id: role.id,
          name: role.name,
        },
        accountType: adminUser.accountType,
        status: adminUser.status,
        createdAt: adminUser.createdAt ? adminUser.createdAt.toISO() : null,
      },
    })
  } catch (error: any) {
    if (error.status === 422) {
      return response.unprocessableEntity({
        errors: error.messages || [{ message: 'Validation failed.' }],
      })
    }

    logger.error({ err: error }, `Failed to invite admin user: ${error?.message || error}`)

    return response.internalServerError({
      errors: [{ message: 'Failed to send admin invitation. Please try again.' }],
    })
  }
}

  /**
   * 2. List all teams with total member counts
   */
  async listTeams({ response }: HttpContext) {
    try {
      const teams = await Team.query()
        .withCount('members')
        .orderBy('createdAt', 'desc')

      const formattedTeams = teams.map((team) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        totalMembers: Number(team.$extras.members_count || 0),
        createdAt: team.createdAt ? team.createdAt.toISO() : null,
        updatedAt: team.updatedAt ? team.updatedAt.toISO() : null,
      }))

      return response.ok({
        success: true,
        data: formattedTeams,
      })
    } catch (error: any) {
      logger.error({ err: error }, `Failed to fetch teams list: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve teams list. Please try again.' }],
      })
    }
  }

  /**
   * 3. Create a new Team
   */
  async createTeam(ctx: HttpContext) {
    const { request, response } = ctx

    try {
      const payload = await request.validateUsing(createTeamValidator)

      const existingTeam = await Team.query().where('name', payload.name).first()
      if (existingTeam) {
        return response.badRequest({
          errors: [{ message: 'A team with this name already exists.' }],
        })
      }

      const team = await Team.create({
        name: payload.name,
        description: payload.description,
      })

      await logAudit(ctx, {
        action: 'CREATE_TEAM',
        entity: 'teams',
        entityId: team.id,
        oldValues: null,
        newValues: {
          id: team.id,
          name: team.name,
        },
      })

      return response.created({
        success: true,
        message: 'Team created successfully.',
        data: {
          id: team.id,
          name: team.name,
          createdAt: team.createdAt ? team.createdAt.toISO() : null,
          updatedAt: team.updatedAt ? team.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error }, `Failed to create team: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to create team. Please try again.' }],
      })
    }
  }

  /**
   * 4. Edit / Update an existing Team
   */
  async updateTeam(ctx: HttpContext) {
    const { params, request, response } = ctx
    const teamId = params.id

    try {
      const payload = await request.validateUsing(updateTeamValidator)

      const team = await Team.find(teamId)
      if (!team) {
        return response.notFound({
          errors: [{ message: 'Team not found.' }],
        })
      }

      const existingTeam = await Team.query()
        .where('name', payload.name)
        .whereNot('id', team.id)
        .first()

      if (existingTeam) {
        return response.badRequest({
          errors: [{ message: 'Another team with this name already exists.' }],
        })
      }

      const oldName = team.name

      team.name = payload.name
      await team.save()

      await logAudit(ctx, {
        action: 'UPDATE_TEAM',
        entity: 'teams',
        entityId: team.id,
        oldValues: { name: oldName },
        newValues: { name: team.name },
      })

      return response.ok({
        success: true,
        message: 'Team updated successfully.',
        data: {
          id: team.id,
          name: team.name,
          createdAt: team.createdAt ? team.createdAt.toISO() : null,
          updatedAt: team.updatedAt ? team.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error, teamId }, `Failed to update team: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to update team. Please try again.' }],
      })
    }
  }

  /**
   * 5. Get details of a single team with team members
   */
  async showTeam({ params, response }: HttpContext) {
    const teamId = params.id

    try {
      const team = await Team.query()
        .where('id', teamId)
        .withCount('members')
        .preload('members', (userQuery) => {
          userQuery
            .select(['id', 'email', 'role', 'accountType', 'status', 'createdAt'])
            .preload('adminProfile', (profileQuery) => {
              profileQuery.select(['firstName', 'lastName', 'phone', 'avatar'])
            })
        })
        .first()

      if (!team) {
        return response.notFound({
          errors: [{ message: 'Team not found.' }],
        })
      }

      return response.ok({
        success: true,
        data: {
          id: team.id,
          name: team.name,
          totalMembers: Number(team.$extras.members_count || 0),
          members: team.members.map((member) => ({
            id: member.id,
            email: member.email,
            role: member.role,
            status: member.status,
            profile: member.adminProfile
              ? {
                  firstName: member.adminProfile.firstName,
                  lastName: member.adminProfile.lastName,
                  phone: member.adminProfile.phone,
                  avatar: member.adminProfile.avatar,
                }
              : null,
            joinedAt: member.createdAt ? member.createdAt.toISO() : null,
          })),
          createdAt: team.createdAt ? team.createdAt.toISO() : null,
          updatedAt: team.updatedAt ? team.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      logger.error({ err: error, teamId }, `Failed to fetch team details: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve team details. Please try again.' }],
      })
    }
  }

  /**
   * List all admin/staff users (where role is NOT 'customer')
   * Supports pagination, filtering by status, and searching by email
   */
  async listMembers({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const status = request.input('status') // e.g. 'active', 'pending', 'suspended'
      const search = request.input('search') // e.g. email or profile search

      const usersQuery = User.query()
        .whereNot('role', 'customer')
        .preload('team', (teamQuery) => {
          teamQuery.select(['id', 'name'])
        })
        .preload('adminProfile', (profileQuery) => {
          profileQuery.select(['firstName', 'lastName', 'phone', 'avatar'])
        })
        .orderBy('createdAt', 'desc')

      // Optional status filter
      if (status) {
        usersQuery.where('status', status)
      }

      // Optional search filter across email or profile name
      if (search) {
        usersQuery.where((builder) => {
          builder
            .whereILike('email', `%${search}%`)
            .orWhereHas('adminProfile', (profileQuery) => {
              profileQuery
                .whereILike('firstName', `%${search}%`)
                .orWhereILike('lastName', `%${search}%`)
            })
        })
      }

      const users = await usersQuery.paginate(page, limit)

      return response.ok({
        success: true,
        data: users.all().map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          accountType: user.accountType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          team: user.team
            ? {
                id: user.team.id,
                name: user.team.name,
              }
            : null,
          profile: user.adminProfile
            ? {
                firstName: user.adminProfile.firstName,
                lastName: user.adminProfile.lastName,
                phone: user.adminProfile.phone,
                avatar: user.adminProfile.avatar,
              }
            : null,
          createdAt: user.createdAt ? user.createdAt.toISO() : null,
          updatedAt: user.updatedAt ? user.updatedAt.toISO() : null,
        })),
        meta: users.getMeta(),
      })
    } catch (error: any) {
      logger.error({ err: error }, `Failed to fetch team members list: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve team members list. Please try again.' }],
      })
    }
  }
}