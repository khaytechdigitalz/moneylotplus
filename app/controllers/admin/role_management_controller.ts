import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import Team from '#models/team'
import Permission from '#models/permission'
import {
  createRoleValidator,
  updateRoleValidator,
  toggleRoleStatusValidator,
} from '#validators/role_management_validator'
import logger from '@adonisjs/core/services/logger'
import { logAudit } from '#services/audit_service'

export default class RoleManagementController {
  /**
   * 1. List all available system permissions (grouped by module)
   */
  async listPermissions({ response }: HttpContext) {
    try {
      const permissions = await Permission.query().orderBy('module', 'asc')

      const grouped = permissions.reduce((acc: Record<string, any[]>, item) => {
        if (!acc[item.module]) {
          acc[item.module] = []
        }
        acc[item.module].push({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
        })
        return acc;
      }, {})

      return response.ok({
        success: true,
        data: grouped,
      })
    } catch (error: any) {
      logger.error({ err: error }, `Failed to fetch permissions: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve permissions list. Please try again.' }],
      })
    }
  }

  /**
   * 2. List all roles with attached team & permissions count
   */
  async listRoles({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const teamId = request.input('teamId')
      const status = request.input('status')

      const query = Role.query()
        .preload('team', (t) => t.select(['id', 'name']))
        .withCount('permissions')
        .orderBy('createdAt', 'desc')

      if (teamId) {
        query.where('teamId', teamId)
      }

      if (status) {
        query.where('status', status)
      }

      const roles = await query.paginate(page, limit)

      return response.ok({
        success: true,
        data: roles.all().map((role) => ({
          id: role.id,
          name: role.name,
          status: role.status,
          team: role.team
            ? {
                id: role.team.id,
                name: role.team.name,
              }
            : null,
          totalPermissions: Number(role.$extras.permissions_count || 0),
          createdAt: role.createdAt ? role.createdAt.toISO() : null,
          updatedAt: role.updatedAt ? role.updatedAt.toISO() : null,
        })),
        meta: roles.getMeta(),
      })
    } catch (error: any) {
      logger.error({ err: error }, `Failed to fetch roles: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve roles list. Please try again.' }],
      })
    }
  }

  /**
   * 3. Create a new Role with Team assignment and permissions
   */
  async createRole(ctx: HttpContext) {
    const { request, response } = ctx

    try {
      const payload = await request.validateUsing(createRoleValidator)

      // Ensure Team exists
      const team = await Team.find(payload.teamId)
      if (!team) {
        return response.notFound({
          errors: [{ message: 'Selected team does not exist.' }],
        })
      }

      // Check role name uniqueness within the team
      const existingRole = await Role.query()
        .where('teamId', payload.teamId)
        .where('name', payload.name)
        .first()

      if (existingRole) {
        return response.badRequest({
          errors: [{ message: 'A role with this name already exists in the selected team.' }],
        })
      }

      // Create role
      const role = await Role.create({
        name: payload.name,
        teamId: payload.teamId,
        status: 'active',
      })

      // Attach permissions via pivot table
      if (payload.permissionIds && payload.permissionIds.length > 0) {
        await role.related('permissions').attach(payload.permissionIds)
      }

      await role.load('permissions')

      // Record Audit Log
      await logAudit(ctx, {
        action: 'CREATE_ROLE',
        entity: 'roles',
        entityId: role.id,
        oldValues: null,
        newValues: {
          id: role.id,
          name: role.name,
          teamId: role.teamId,
          permissionIds: payload.permissionIds,
        },
      })

      return response.created({
        success: true,
        message: 'Role created successfully.',
        data: {
          id: role.id,
          name: role.name,
          status: role.status,
          teamId: role.teamId,
          permissions: role.permissions.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
          createdAt: role.createdAt ? role.createdAt.toISO() : null,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error }, `Failed to create role: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to create role. Please try again.' }],
      })
    }
  }

  /**
   * 4. View a single role detail with full attached permissions
   */
  async showRole({ params, response }: HttpContext) {
    const { id } = params

    try {
      const role = await Role.query()
        .where('id', id)
        .preload('team', (t) => t.select(['id', 'name']))
        .preload('permissions')
        .first()

      if (!role) {
        return response.notFound({
          errors: [{ message: 'Role not found.' }],
        })
      }

      return response.ok({
        success: true,
        data: {
          id: role.id,
          name: role.name,
          status: role.status,
          team: role.team ? { id: role.team.id, name: role.team.name } : null,
          permissions: role.permissions.map((p) => ({
            id: p.id,
            module: p.module,
            name: p.name,
            slug: p.slug,
          })),
          createdAt: role.createdAt ? role.createdAt.toISO() : null,
          updatedAt: role.updatedAt ? role.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      logger.error({ err: error, id }, `Failed to fetch role detail: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve role details. Please try again.' }],
      })
    }
  }

  /**
   * 5. Update role name and sync permissions
   */
  async updateRole(ctx: HttpContext) {
    const { params, request, response } = ctx
    const { id } = params

    try {
      const payload = await request.validateUsing(updateRoleValidator)

      const role = await Role.find(id)
      if (!role) {
        return response.notFound({
          errors: [{ message: 'Role not found.' }],
        })
      }

      const oldValues: Record<string, any> = { name: role.name }

      if (payload.name && payload.name !== role.name) {
        const existingRole = await Role.query()
          .where('teamId', role.teamId)
          .where('name', payload.name)
          .whereNot('id', role.id)
          .first()

        if (existingRole) {
          return response.badRequest({
            errors: [{ message: 'Another role with this name already exists in this team.' }],
          })
        }
        role.name = payload.name
      }

      await role.save()

      // Sync updated permissions
     if (payload.permissionIds) {
        const currentPermissions = await role.related('permissions').query().select('id')
        oldValues.permissionIds = currentPermissions.map((p) => p.id)

        // 2. Sync the new array of permission IDs in the pivot table
        await role.related('permissions').sync(payload.permissionIds)
      }

      await role.load('permissions')

      // Record Audit Log
      await logAudit(ctx, {
        action: 'UPDATE_ROLE',
        entity: 'roles',
        entityId: role.id,
        oldValues,
        newValues: {
          name: role.name,
          permissionIds: payload.permissionIds,
        },
      })

      return response.ok({
        success: true,
        message: 'Role permissions and details updated successfully.',
        data: {
          id: role.id,
          name: role.name,
          status: role.status,
          permissions: role.permissions.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
          updatedAt: role.updatedAt ? role.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error, id }, `Failed to update role: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to update role. Please try again.' }],
      })
    }
  }

  /**
   * 6. Deactivate / Activate a role
   */
  async toggleStatus(ctx: HttpContext) {
    const { params, request, response } = ctx
    const { id } = params

    try {
      const payload = await request.validateUsing(toggleRoleStatusValidator)

      const role = await Role.find(id)
      if (!role) {
        return response.notFound({
          errors: [{ message: 'Role not found.' }],
        })
      }

      const oldStatus = role.status
      role.status = payload.status
      await role.save()

      // Record Audit Log
      await logAudit(ctx, {
        action: 'TOGGLE_ROLE_STATUS',
        entity: 'roles',
        entityId: role.id,
        oldValues: { status: oldStatus },
        newValues: { status: role.status },
      })

      return response.ok({
        success: true,
        message: `Role status updated to ${role.status} successfully.`,
        data: {
          id: role.id,
          name: role.name,
          status: role.status,
          updatedAt: role.updatedAt ? role.updatedAt.toISO() : null,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error, id }, `Failed to toggle role status: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to toggle role status. Please try again.' }],
      })
    }
  }
}