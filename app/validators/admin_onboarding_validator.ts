// app/validators/admin_onboarding_validator.ts
import vine from '@vinejs/vine'

export const acceptInviteValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    phone: vine.string().trim().minLength(7),
    password: vine.string().minLength(8).confirmed(),
  })
)

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    otp: vine.string().trim().fixedLength(6),
  })
)