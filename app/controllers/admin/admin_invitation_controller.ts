import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserAdminProfile from '#models/user_admin_profile'
import { acceptInviteValidator, verifyOtpValidator } from '#validators/admin_onboarding_validator'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export default class AdminInvitationController {
  /**
   * 1. GET: Fetch admin details by invitation token
   */
  async getInviteDetails({ params, response }: HttpContext) {
    const token = params.token

    try {
      const user = await User.query()
        .where('otpToken', token)
        .where('role', 'admin')
        .where('accountType', 'admin')
        .where('status', 'pending')
        .where('is_email_verified', 0)
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Invalid or expired invitation token.' }],
        })
      }

      return response.ok({
        success: true,
        data: {
          email: user.email,
          role: user.role,
          accountType: user.accountType,
          status: user.status,
        },
      })
    } catch (error: any) {
      logger.error({ err: error, token }, 'Failed to fetch invitation details.')
      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve invitation details.' }],
      })
    }
  }

  /**
   * 2. POST: Submit profile info, set password, & generate 6-digit OTP
   */
  async acceptInvite({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(acceptInviteValidator)

      // Find user by token
      const user = await User.query()
        .where('otpToken', payload.token)
        .where('role', 'admin')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Invalid or expired invitation token.' }],
        })
      }

      // Create or update profile record
      await UserAdminProfile.updateOrCreate(
        { userId: user.id },
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
        }
      )

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

      // Update User credentials and OTP details
      user.password = payload.password
      user.otpToken = otpCode
      user.otpTokenSentAt = DateTime.now()
      await user.save()

      // Send 6-digit OTP Email
      try {
        await mail.send((message) => {
          message
            .to(user.email)
            .subject('Your Verification Code - MoneyLot Admin Setup')
            .htmlView('emails/admin_otp', {
              email: user.email,
              otp: otpCode,
            })
        })
      } catch (mailError: any) {
        logger.error({ err: mailError, userId: user.id }, 'Failed to send admin verification OTP.')
      }

      return response.ok({
        success: true,
        message: 'Account details configured successfully. A 6-digit verification code has been sent to your email.',
        data: {
          email: user.email,
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error }, 'Failed to process admin invitation acceptance.')
      return response.internalServerError({
        errors: [{ message: 'Failed to complete profile setup. Please try again.' }],
      })
    }
  }

  /**
   * 3. POST: Verify 6-digit OTP and activate account
   */
  async verifyOtp({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(verifyOtpValidator)

      const user = await User.query()
        .where('email', payload.email)
        .where('otpToken', payload.otp)
        .where('role', 'admin')
        .first()

      if (!user) {
        return response.badRequest({
          errors: [{ message: 'Invalid verification code or email address.' }],
        })
      }

      // Mark email as verified and activate account
      user.isEmailVerified = true
      user.emailVerifiedAt = DateTime.now()
      user.status = 'active'
      user.otpToken = null // Clear OTP token
      await user.save()

      return response.ok({
        success: true,
        message: 'Email verified successfully. Your admin account is now active.',
        data: {
          id: user.id,
          email: user.email,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt.toISO(),
        },
      })
    } catch (error: any) {
      if (error.status === 422) {
        return response.unprocessableEntity({
          errors: error.messages || [{ message: 'Validation failed.' }],
        })
      }

      logger.error({ err: error }, 'Failed to verify admin OTP.')
      return response.internalServerError({
        errors: [{ message: 'Verification failed. Please try again.' }],
      })
    }
  }
}