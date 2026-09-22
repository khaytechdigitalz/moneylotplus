import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import { logUserLogin } from '#services/login_logger_service'

// Configuration constants
const MAX_LOGIN_ATTEMPTS = 5
const TWO_FACTOR_TOKEN_TTL_MINUTES = 10
const DUMMY_HASH = '$2b$10$e8p2uX4...dummyhashfor timingattackprotection...'

// ==========================================
// VineJS Validators
// ==========================================
const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string(),
  })
)

const verifyTwoFactorValidator = vine.compile(
  vine.object({
    tempToken: vine.string().trim(),
    code: vine.string().trim().minLength(6).maxLength(6),
  })
)

const sendOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
  })
)

const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    otp: vine.string().trim().minLength(6).maxLength(6),
  })
)

const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    otp: vine.string().trim().minLength(6).maxLength(6),
    password: vine.string().minLength(8),
  })
)

export default class AdminAuthController {
  /**
   * 1. Admin Login
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(adminLoginValidator)

    // 1. Fetch the user
    const user = await User.findBy('email', email)

    // SECURITY: Timing Attack Protection
    if (!user) {
      try {
        await hash.verify(DUMMY_HASH, password)
      } catch {
        // swallow dummy verification error
      }
      return response.badRequest({ errors: [{ message: 'Invalid admin credentials' }] })
    }

    // Check Admin Privileges
    if (!['admin', 'team'].includes(user.role) && user.accountType !== 'admin') {
      return response.forbidden({
        errors: [{ message: 'Access denied. Account lacks administrative privileges.' }],
      })
    }

    // 2. CHECK LOCKOUT FIRST
    if (user.blockedUntil && user.blockedUntil > DateTime.now()) {
      return response.forbidden({
        errors: [
          {
            message: `This account is temporarily locked due to multiple failed login attempts. Please try again after ${user.blockedUntil.toFormat('HH:mm')} or contact support.`,
          },
        ],
      })
    }

    // 3. Verify the password
    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      user.otpTokenAttempts += 1

      if (user.otpTokenAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = 'blocked'
        await user.save()

        return response.forbidden({
          errors: [
            {
              total_attemps: user.otpTokenAttempts,
              max_login_attempt: MAX_LOGIN_ATTEMPTS,
              message:
                'This admin account has been blocked due to multiple failed login attempts. Please contact system support.',
            },
          ],
        })
      }

      await user.save()

      const remainingTrials = MAX_LOGIN_ATTEMPTS - user.otpTokenAttempts

      return response.badRequest({
        errors: [
          {
            remaining_trial: remainingTrials,
            total_attemps: user.otpTokenAttempts,
            max_login_attempt: MAX_LOGIN_ATTEMPTS,
            message: `Invalid credentials. You have ${remainingTrials} ${remainingTrials === 1 ? 'attempt' : 'attempts'} remaining before your account is blocked.`,
          },
        ],
      })
    }

    // 4. Verify account is active
    if (user.status !== 'active') {
      return response.forbidden({
        errors: [{ message: 'This account is not active. Please contact support.' }],
      })
    }

    // 5. Check email verification
    if (!user.isEmailVerified) {
      return response.badRequest({ errors: [{ message: 'Please verify your email first.' }] })
    }

    // 6. Reset password failure counters / lockout upon successful authentication
    if (user.otpTokenAttempts > 0 || user.blockedUntil) {
      user.otpTokenAttempts = 0
      user.blockedUntil = null
      await user.save()
    }

    // 7. Intercept login if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      const tempToken = crypto.randomBytes(32).toString('hex')
      user.otpToken = tempToken
      user.otpTokenExpiresAt = DateTime.now().plus({ minutes: TWO_FACTOR_TOKEN_TTL_MINUTES })

      // Reset 2FA failures specifically so they start with 5 fresh attempts for code verification
      user.otpTokenAttempts = 0
      await user.save()

      return response.ok({
        requiresTwoFactor: true,
        message: 'Two-factor authentication code required to complete login.',
        tempToken,
      })
    }

    // 8. Store Login History
    const ipAddress = request.ip()
    const userAgent = request.header('user-agent') || ''

    try {
      await logUserLogin({
        userId: user.id,
        ipAddress,
        userAgentString: userAgent,
        mfaVerified: false,
      })
    } catch (error) {
      logger.error(error)
    }

    // 9. Generate and return session token (2FA disabled)
    const token = await User.accessTokens.create(user, ['*'], { expiresIn: '8h' })

    return response.ok({
      success: true,
      requiresTwoFactor: false,
      message: 'Admin login successful.',
      token: token.value!.release(),
      admin: {
        id: user.id,
        email: user.email,
        role: user.role || user.accountType,
      },
    })
  }

  /**
   * 2. Verify 2FA via tempToken & Generate Final Access Token
   */
  async verifyTwoFactor({ request, response }: HttpContext) {
    const { tempToken, code } = await request.validateUsing(verifyTwoFactorValidator)

    // 1. Find user matching tempToken
    const user = await User.findBy('otpToken', tempToken)

    if (!user || !user.otpTokenExpiresAt || user.otpTokenExpiresAt < DateTime.now()) {
      return response.badRequest({
        errors: [{ message: 'Invalid or expired 2FA login session. Please login again.' }],
      })
    }

    // Ensure admin privilege
    if (user.role !== 'admin' && user.accountType !== 'admin') {
      return response.forbidden({
        errors: [{ message: 'Access denied. Account lacks administrative privileges.' }],
      })
    }

    // 2. Verify TOTP / 2FA code (replace with actual TOTP verification logic e.g., speakeasy/otplib)
    const isValidCode = user.mfaSecret === code || code === '123456' // Replace '123456' with totp.verify()

    if (!isValidCode) {
      user.otpTokenAttempts += 1

      if (user.otpTokenAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = 'blocked'
        user.otpToken = null
        user.otpTokenExpiresAt = null
        await user.save()

        return response.forbidden({
          errors: [
            {
              total_attemps: user.otpTokenAttempts,
              max_login_attempt: MAX_LOGIN_ATTEMPTS,
              message: 'Account blocked due to multiple invalid 2FA attempts.',
            },
          ],
        })
      }

      await user.save()
      const remaining = MAX_LOGIN_ATTEMPTS - user.otpTokenAttempts

      return response.badRequest({
        errors: [
          {
            remaining_trial: remaining,
            total_attemps: user.otpTokenAttempts,
            max_login_attempt: MAX_LOGIN_ATTEMPTS,
            message: `Invalid 2FA code. You have ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`,
          },
        ],
      })
    }

    // 3. Clear temporary 2FA token & attempts
    user.otpToken = null
    user.otpTokenExpiresAt = null
    user.otpTokenAttempts = 0
    await user.save()

    // 4. Record MFA Login History
    const ipAddress = request.ip()
    const userAgent = request.header('user-agent') || ''

    try {
      await logUserLogin({
        userId: user.id,
        ipAddress,
        userAgentString: userAgent,
        mfaVerified: true,
      })
    } catch (error) {
      logger.error(error)
    }

    // 5. Create real session token
    const token = await User.accessTokens.create(user, ['*'], { expiresIn: '8h' })

    return response.ok({
      success: true,
      message: 'Admin 2FA verification successful.',
      token: token.value!.release(),
      admin: {
        id: user.id,
        email: user.email,
        role: user.role || user.accountType,
      },
    })
  }

  /**
   * 3. Forgot Password - Send OTP
   */
  async sendForgotOtp({ request, response }: HttpContext) {
    const payload = await request.validateUsing(sendOtpValidator)

    const user = await User.findBy('email', payload.email)
    if (!user || (user.role !== 'admin' && user.accountType !== 'admin')) {
      return response.ok({
        success: true,
        message: 'If an admin account exists with this email, a reset code has been sent.',
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otpToken = otp
    user.otpTokenExpiresAt = DateTime.now().plus({ minutes: 15 })
    await user.save()

    try {
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Admin Password Reset Code')
          .htmlView('emails/admin_forgot_password', { otp })
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to send admin password reset email')
    }

    return response.ok({
      success: true,
      message: 'Password reset OTP sent to your email.',
    })
  }

  /**
   * 4. Forgot Password - Resend OTP
   */
  async resendForgotOtp({ request, response }: HttpContext) {
    return this.sendForgotOtp({ request, response } as HttpContext)
  }

  /**
   * 5. Forgot Password - Verify OTP
   */
  async verifyForgotOtp({ request, response }: HttpContext) {
    const payload = await request.validateUsing(verifyOtpValidator)

    const user = await User.findBy('email', payload.email)
    if (!user || (user.role !== 'admin' && user.accountType !== 'admin')) {
      return response.badRequest({ errors: [{ message: 'Invalid or expired OTP.' }] })
    }

    if (
      !user.otpToken ||
      user.otpToken !== payload.otp ||
      !user.otpTokenExpiresAt ||
      user.otpTokenExpiresAt < DateTime.now()
    ) {
      return response.badRequest({ errors: [{ message: 'Invalid or expired OTP.' }] })
    }

    return response.ok({
      success: true,
      message: 'OTP verified successfully.',
    })
  }

  /**
   * 6. Forgot Password - Reset Password
   */
  async resetPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator)

    const user = await User.findBy('email', payload.email)
    if (!user || (user.role !== 'admin' && user.accountType !== 'admin')) {
      return response.badRequest({ errors: [{ message: 'Invalid request.' }] })
    }

    if (
      !user.otpToken ||
      user.otpToken !== payload.otp ||
      !user.otpTokenExpiresAt ||
      user.otpTokenExpiresAt < DateTime.now()
    ) {
      return response.badRequest({ errors: [{ message: 'Invalid or expired OTP.' }] })
    }

    user.password = payload.password
    user.otpToken = null
    user.otpTokenExpiresAt = null
    user.otpTokenAttempts = 0
    await user.save()

    return response.ok({
      success: true,
      message: 'Admin password reset successfully. You can now login.',
    })
  }

  /**
   * 7. Get Current Admin
   */
  async me({ auth, response }: HttpContext) {
    const admin = auth.user!
    return response.ok({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role || admin.accountType,
      },
    })
  }

  /**
   * 8. Logout
   */
   async logout({ auth, response }: HttpContext) {
      await auth.authenticate()
      const user = auth.user!
  
      const token = (user as any).currentAccessToken
  
      if (token) {
        await User.accessTokens.delete(user, token.identifier)
      }
  
      return response.ok({
        success: true,
        message: 'Logged out successfully',
      })
    }
}