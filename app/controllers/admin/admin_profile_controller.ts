import type { HttpContext } from '@adonisjs/core/http'
import UserAdminProfile from '#models/user_admin_profile'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { updateProfileValidator, updatePasswordValidator } from '#validators/admin_profile_validator'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import { logAudit } from '#services/audit_service'

export default class AdminProfileController {
  /**
   * 1. View Current Admin Profile Details
   */
  async show({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      // Fetch Profile associated with the logged-in admin user
      const profile = await UserAdminProfile.query()
        .where('userId', user.id)
        .first()

      return response.ok({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          accountType: user.accountType,
          status: user.status,
          profile: profile
            ? {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                avatar: profile.avatar,
                createdAt: profile.createdAt ? profile.createdAt.toISO() : null,
                updatedAt: profile.updatedAt ? profile.updatedAt.toISO() : null,
              }
            : null,
        },
      })
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to fetch admin profile settings.')
      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve profile details.' }],
      })
    }
  }

  /**
   * 2. Update Profile Information (Name, Phone, Avatar Image File)
   */
  async updateProfile(ctx: HttpContext) {
    const { auth, request, response } = ctx

    try {
      const user = auth.user!

      // 1. Validate payload (including file validation for avatar)
      const payload = await request.validateUsing(updateProfileValidator)

      // 2. Fetch or initialize admin profile record
      const profile = await UserAdminProfile.firstOrCreate(
        { userId: user.id },
        { userId: user.id }
      )

      // Capture old state before modification for audit log
      const oldValues = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        avatar: profile.avatar,
      }

      // 3. Process image file upload if provided
      const avatarFile = request.file('avatar')
      if (avatarFile && avatarFile.isValid) {
        const fileName = `avatar_${user.id}_${Date.now()}.${avatarFile.extname}`

        // Move file to public uploads directory
        await avatarFile.move(app.makePath('public/uploads/avatars'), {
          name: fileName,
          overwrite: true,
        })

        // Store accessible relative file path in DB
        profile.avatar = `/uploads/avatars/${fileName}`
      }

      // 4. Update text fields
      if (payload.firstName !== undefined) profile.firstName = payload.firstName
      if (payload.lastName !== undefined) profile.lastName = payload.lastName
      if (payload.phone !== undefined) profile.phone = payload.phone

      await profile.save()

      // Capture new values
      const newValues = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        avatar: profile.avatar,
      }

      // 5. Record Audit Log
      await logAudit(ctx, {
        action: 'UPDATE_ADMIN_PROFILE',
        entity: 'users_admin_profiles',
        entityId: profile.id,
        oldValues,
        newValues,
      })

      // 6. Return updated profile payload
      return response.ok({
        success: true,
        message: 'Admin profile updated successfully.',
        data: {
          id: user.id,
          email: user.email,
          profile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            avatar: profile.avatar,
            updatedAt: profile.updatedAt ? profile.updatedAt.toISO() : null,
          },
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error, userId: auth.user?.id }, 'Failed to update admin profile.')
      return response.internalServerError({
        errors: [{ message: 'Failed to update profile settings.' }],
      })
    }
  }

  /**
   * 3. Update Account Password
   */
  async updatePassword(ctx: HttpContext) {
    const { auth, request, response } = ctx

    try {
      const user = auth.user! as User
      const payload = await request.validateUsing(updatePasswordValidator)

      // Verify current password match
      const isPasswordValid = await hash.verify(user.password, payload.currentPassword)
      if (!isPasswordValid) {
        return response.badRequest({
          errors: [{ message: 'Current password provided is incorrect.' }],
        })
      }

      // Update to new password
      user.password = payload.newPassword
      await user.save()

      // Record Audit Log (Omit actual hashed/plain passwords for security)
      await logAudit(ctx, {
        action: 'UPDATE_ADMIN_PASSWORD',
        entity: 'users',
        entityId: user.id,
        oldValues: { passwordChanged: false },
        newValues: { passwordChanged: true },
      })

      return response.ok({
        success: true,
        message: 'Password updated successfully.',
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error, userId: auth.user?.id }, 'Failed to update admin password.')
      return response.internalServerError({
        errors: [{ message: 'Failed to update password. Please try again.' }],
      })
    }
  }
}