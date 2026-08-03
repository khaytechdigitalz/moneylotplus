// app/controllers/verify_email_controller.ts
import env from '#start/env' 
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DateTime } from 'luxon'
import EncryptionService from '#services/encryption_service'

export default class VerifyEmailController {
  /**
   * Handle the email verification link click
   */
  async verify({ params, response }: HttpContext) {
    try {
      // 1. Find the user by the ID passed in the URL parameters
      const user = await User.find(params.id)
      const FRONT_URL = env.get('FRONT_URL')

      if (!user) {
        const redirect = `${FRONT_URL}/login?status=failed&message=user_not_found`
        return response.redirect().toPath(redirect)
      }

      // 2. If the user is already verified, let them know gracefully
      if (user.isEmailVerified) {
        const redirect = `${FRONT_URL}/login?status=failed&message=already_verified`
        return response.redirect().toPath(redirect)
      }

      // 3. Mark the user as verified and store the current timestamp
      user.isEmailVerified = true
      user.status = 'active'
      user.emailVerifiedAt = DateTime.now()
      await user.save()

      // 1. Generate the access token

        const token = await User.accessTokens.create(user)

        // 2. Extract the raw secret string from the AccessToken object
        // AdonisJS access tokens store the secret in token.value
        const rawTokenValue = typeof token.value === 'string' 
          ? token.value 
          : token.value!.release()

        // 3. Encrypt the token value
        const encryptedValue = EncryptionService.encrypt(rawTokenValue)

        // 4. Encode the URI parameter so special characters in the base64 string don't break the URL
        const safeTokenParam = encodeURIComponent(encryptedValue)
      
        const redirect = `${FRONT_URL}/setup-2fa?token=${safeTokenParam}`

        return response.redirect().toPath(redirect)


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.internalServerError({
        message: 'An error occurred during verification.',
        error: errorMessage,
      })
    }
  }
}