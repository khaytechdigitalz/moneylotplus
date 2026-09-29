import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    teamId: vine.number().positive(),
    permissionIds: vine.array(vine.number().positive()).minLength(1),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150).optional(),
    permissionIds: vine.array(vine.number().positive()).optional(),
  })
)

export const toggleRoleStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['active', 'inactive']),
    otp: vine.string(),

  })

)