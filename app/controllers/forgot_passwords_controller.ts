// app/controllers/forgot_passwords_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
// import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main' 

export default class ForgotPasswordsController {
  /**
   * Helper to securely hash the short-lived OTP
   */
  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex')
  }

  /**
   * 1. Send OTP
   */
  async sendOtp({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    if (!email) {
      return response.badRequest({ message: 'Email address is required.' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      // To prevent user enumeration, return success even if the email doesn't exist
      return response.ok({ message: 'If the email exists, an OTP has been sent.' })
    }

    // Check 1-minute cooldown
    if (user.otpTokenSentAt) {
      const differenceInSeconds = DateTime.now().diff(user.otpTokenSentAt, 'seconds').seconds
      if (differenceInSeconds < 60) {
        const remaining = Math.ceil(60 - differenceInSeconds)
        return response.tooManyRequests({
          message: `Please wait ${remaining} seconds before requesting a new OTP.`,
        })
      }
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Securely hash OTP before saving to database
    user.otpToken = this.hashOtp(otp)
    user.otpTokenSentAt = DateTime.now()
    await user.save()

    // TODO: Send OTP to user's email via your mail provider
    await mail.send((message) => {
        message
          .to(user.email)
          .subject('Password Rest OTP')
          .htmlView('emails/forgot_password', { 
            otp: otp, 
            name: user.email 
          })
      })
    console.log(`[EMAIL SIMULATOR] Sending OTP ${otp} to ${user.email}`)

    return response.ok({
      message: 'A 6-digit OTP has been sent to your email address.',
    })
  }

  /**
   * 2. Resend OTP
   */
  async resendOtp({ request, response }: HttpContext) {
    // Reuses the exact same logic and updates the timestamp limit
    return this.sendOtp({ request, response } as HttpContext)
  }

  /**
   * 3. Verify OTP & Return Temporary Reset Token
   */
  async verifyOtp({ request, response }: HttpContext) {
    const { email, otp } = request.only(['email', 'otp'])

    if (!email || !otp) {
      return response.badRequest({ message: 'Email and OTP are required.' })
    }

    const user = await User.findBy('email', email)
    if (!user || !user.otpToken) {
      return response.badRequest({ message: 'Invalid request or expired OTP.' })
    }

    // Hash incoming OTP and compare with stored hash
    const hashedIncomingOtp = this.hashOtp(String(otp).trim())
    if (user.otpToken !== hashedIncomingOtp) {
      return response.badRequest({ message: 'Invalid verification code.' })
    }

    // Generate a secure 20-character random hex token for the password reset step
    const resetToken = crypto.randomBytes(10).toString('hex')

    // Save the reset token to the database and clear the OTP timestamp
    user.otpToken = resetToken
    user.otpTokenSentAt = null
    await user.save()

    return response.ok({
      message: 'OTP verified successfully.',
      resetToken, // Frontend will pass this to the final reset form
    })
  }

  /**
   * 4. Reset Password
   */
  async resetPassword({ request, response }: HttpContext) {
    const { resetToken, password, passwordConfirmation } = request.only([
      'resetToken',
      'password',
      'passwordConfirmation',
    ])

    if (!resetToken || !password || !passwordConfirmation) {
      return response.badRequest({ message: 'All fields are required.' })
    }

    if (password !== passwordConfirmation) {
      return response.badRequest({ message: 'Passwords do not match.' })
    }

    // Find the user by the temporary reset token
    const user = await User.findBy('otp_token', resetToken)
    if (!user) {
      return response.badRequest({ message: 'Your reset session has expired or is invalid.' })
    }

    // Update password (triggers hashing automatically) and burn the reset token
    user.password = password
    user.otpToken = null
    await user.save()

    return response.ok({
      message: 'Your password has been successfully updated! You can now log in.',
    })
  }
}