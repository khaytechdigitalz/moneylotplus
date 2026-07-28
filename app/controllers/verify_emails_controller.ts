// app/controllers/verify_email_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class VerifyEmailController {
  /**
   * Handle the email verification link click
   */
  async verify({ params, response }: HttpContext) {
    try {
      // 1. Find the user by the ID passed in the URL parameters
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({ message: 'User not found.' })
      }

      // 2. If the user is already verified, let them know gracefully
      if (user.isEmailVerified) {
        return response.ok({ message: 'Email address is already verified.' })
      }

      // 3. Mark the user as verified and store the current timestamp
      user.isEmailVerified = true
      user.status = 'active'
      user.emailVerifiedAt = DateTime.now()
      await user.save()

      return response.ok({
        message: 'Email verified successfully! You can now log in.',
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.internalServerError({
        message: 'An error occurred during verification.',
        error: errorMessage,
      })
    }
  }
}