// app/validators/admin_profile_validator.ts
import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).optional(),
    lastName: vine.string().trim().minLength(2).optional(),
    phone: vine.string().trim().minLength(7).optional(),
    avatar: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
      .optional(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine.string().minLength(8).confirmed(),
  })
)