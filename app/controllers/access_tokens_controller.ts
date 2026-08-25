// app/controllers/access_tokens_controller.ts
import User from '#models/user'
import crypto from 'node:crypto'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { logUserLogin } from '#services/login_logger_service'
import { verify } from 'otplib'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

const DUMMY_HASH = '$scrypt$n=16384,r=8,p=1$c2FsdHNhbHRzYWx0c2FsdA$ZHVtbXlkdW1teWR1bW15ZHVtbXlkdW1teWR1bW15ZHVtbXk'

const MAX_LOGIN_ATTEMPTS = 3
const MAX_TWO_FACTOR_ATTEMPTS = 5
const TWO_FACTOR_TOKEN_TTL_MINUTES = 10

export default class AccessTokensController {
  async store({ request, response, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // 1. Fetch the user
    const user = await User.findBy('email', email)

    // SECURITY: Timing Attack Protection
    if (!user) {
      try {
        await hash.verify(DUMMY_HASH, password)
      } catch {
        // swallow dummy verification
      }
      return response.badRequest({ errors: [{ message: 'Invalid user credentials' }] })
    }

    // 2. CHECK LOCKOUT FIRST (Saves CPU, prevents password-probing side channels)
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
      // Increment the counter (using your otpTokenAttempts column)
      user.otpTokenAttempts += 1

      if (user.otpTokenAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = 'blocked'
        await user.save()

        return response.forbidden({
          errors: [{ 
          total_attemps: user.otpTokenAttempts,
          max_login_attempt: MAX_LOGIN_ATTEMPTS,
          message: 'This account has been blocked due to multiple failed login attempts. Please contact support.'
         }]
        })
      }

      await user.save()

      // Calculate how many attempts they have left
      const remainingTrials = MAX_LOGIN_ATTEMPTS - user.otpTokenAttempts

      return response.badRequest({
        errors: [{
          remaining_trial: remainingTrials,
          total_attemps: user.otpTokenAttempts,
          max_login_attempt: MAX_LOGIN_ATTEMPTS,
          message: `Invalid credentials. You have ${remainingTrials} ${remainingTrials === 1 ? 'attempt' : 'attempts'} remaining before your account is blocked.`
        }]
      })
    }

    // 4. Verify account is fully 'active'
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

      // Reset 2FA failures specifically so they start with 5 fresh attempts
      user.otpTokenAttempts = 0
      await user.save()
      
      return response.ok({
        requiresTwoFactor: true,
        message: 'Two-factor authentication code required to complete login.',
        tempToken,
      })
    }

    // 8 Store Login History
    const ipAddress = request.ip()
    const userAgent = request.header('user-agent') || ''

    try {
      await logUserLogin({
        userId: user.id,
        ipAddress,
        userAgentString: userAgent,
        mfaVerified: false
      })
    }
    catch (error) {
      logger.error(error)

    }

    // 9. Generate and return session token (2FA disabled)
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async verifyTwoFactor({ request, response, serialize }: HttpContext) {
    const { tempToken, code } = request.only(['tempToken', 'code'])

    // 1. Validate existence
    if (!tempToken || !code) {
      return response.badRequest({ message: 'The temporary token and verification code are required.' })
    }

    // 2. Strict format validation
    const cleanCode = String(code).trim()
    if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
      return response.badRequest({ message: 'The verification code must be exactly 6 numeric digits.' })
    }

    // 3. Find the user
    const user = await User.findBy('otp_token', tempToken)
    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
      return response.badRequest({ message: 'Invalid or expired login attempt.' })
    }

    // 3b. Reject if the temp token has expired
    if (!user.otpTokenExpiresAt || user.otpTokenExpiresAt < DateTime.now()) {
      user.otpToken = null
      user.otpTokenExpiresAt = null
      await user.save()
      return response.badRequest({ message: 'Invalid or expired login attempt.' })
    }

    // 3c. Brute-force protection: Check 2FA counter strictly
    if (user.otpTokenAttempts >= MAX_TWO_FACTOR_ATTEMPTS) {
      user.otpToken = null
      user.otpTokenExpiresAt = null
      user.otpTokenAttempts = 0 // reset counter
      await user.save()
      return response.badRequest({ message: 'Too many attempts. Please log in again.' })
    }

    // Block 2FA verification if the account is disabled
    if (user.status !== 'active') {
      return response.forbidden({ message: 'This account is not active. Please contact support.' })
    }

    // 4. Cryptographically verify the code
    const isValid = await verify({
      token: cleanCode,
      secret: user.twoFactorSecret
    })

    console.log(`[2FA DEBUG] Cryptographic validation result:`, isValid)

    // 5. Explicitly check if the OTP code is invalid
    if (!isValid || isValid.valid != true) {
      user.otpTokenAttempts += 1
      await user.save()
      return response.badRequest({ message: 'Invalid verification code. Please try again.' })
    }

    // 6. Success! Burn temporary tokens and reset 2FA tracking
    user.otpToken = null
    user.otpTokenExpiresAt = null
    user.otpTokenAttempts = 0
    await user.save()

    // 7 Store Login History
    const ipAddress = request.ip()
    const userAgent = request.header('user-agent') || ''

    try {
      await logUserLogin({
        userId: user.id,
        ipAddress,
        userAgentString: userAgent,
        mfaVerified: true
      })
    }
    catch (error) {
      logger.error(error)

    }

    // 8. Generate session token
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.authenticate()
    const user = auth.user!

    const token = (user as any).currentAccessToken

    if (token) {
      await User.accessTokens.delete(user, token.identifier)
    }

    return response.ok({
      message: 'Logged out successfully',
    })
  }
}