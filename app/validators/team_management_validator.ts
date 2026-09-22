import vine from '@vinejs/vine'

export const inviteAdminValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    teamId: vine.number().positive(),
    roleId: vine.number().positive(),
  })
)

export const createTeamValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    description: vine.string().trim().minLength(2).maxLength(150),
  })
)

export const updateTeamValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    description: vine.string().trim().minLength(2).maxLength(150),
  })
)