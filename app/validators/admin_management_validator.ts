import vine from '@vinejs/vine'

export const inviteAdminValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    teamId: vine.number().positive(),
    roleId: vine.number().positive(),
  })
)