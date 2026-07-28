// app/controllers/mfa_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { generateSecret, generateURI, verify } from 'otplib' // Functional helpers
import qrcode from 'qrcode'

export default class MfaController {
  /**
   * 1. Generate 2FA Secret and QR Code for Setup
   */
  async setup({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      // Check against our permanent column
      if (user.isTwoFactorEnabled) {
        return response.badRequest({ message: '2FA is already enabled on this account.' })
      }

      // Generate a cryptographically secure base32 secret
      const secret = generateSecret()

      // Save the secret directly to the permanent 2FA column
      user.twoFactorSecret = secret
      await user.save()

      // Generate the provisioning URI used by authenticator apps (Google Auth, Duo, Authy)
      const otpauthUrl = generateURI({
        secret,
        label: user.email,
        issuer: 'Moneylot Plus',
      })

      // Convert the URI into a Base64 QR Code image string
      const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl)

      return response.ok({
        secret,
        qrCode: qrCodeDataUrl,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.internalServerError({
        message: 'Could not generate 2FA configuration.',
        error: errorMessage,
      })
    }
  }

  /**
   * 2. Verify Code & Complete Activation
   */
  async verifyAndEnable({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { code } = request.only(['code'])

      if (!code) {
        return response.badRequest({ message: 'The 6-digit verification code is required.' })
      }

      // Verify setup sequence was initiated
      if (!user.twoFactorSecret) {
        return response.badRequest({ message: '2FA setup has not been initiated yet.' })
      }

      // Cryptographically verify the submitted 6-digit OTP code against our permanent secret
      const result = verify({
        token: code,
        secret: user.twoFactorSecret,
      })

      if (!result) {
        return response.badRequest({ message: 'Invalid verification code. Please try again.' })
      }

      // Success! Enable 2FA permanently on the correct column
      user.isTwoFactorEnabled = true
      await user.save()

      return response.ok({
        message: 'Two-Factor Authentication enabled successfully!',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.internalServerError({
        message: 'Verification failed due to a server error.',
        error: errorMessage,
      })
    }
  }
}