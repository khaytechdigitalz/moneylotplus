// app/controllers/new_accounts_controller.ts

import env from '#start/env' 
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import { signupValidator } from '#validators/user'
import { validateCompanyHouseNumber,validateCompanyReferenceNumber } from '#services/company_validation_service'

export default class NewAccountsController {
 async signup({ request, response }: HttpContext) {
    // 1. Validate payload
    const payload = await request.validateUsing(signupValidator)
    
    let recipientName = ''
    let fetchedCompanyName: string | undefined = undefined

    if (payload.password !== payload.confirmPassword) {
      return response.badRequest({
        message: 'Password confirmation does not match.'
      })
    }
    // 2. Perform external third-party validations BEFORE opening a database transaction
    if (payload.accountType === 'business') {
      recipientName = payload.representativeFullName!
      
      if (payload.companyNumber) {
        const result = await validateCompanyHouseNumber(payload.companyNumber)
        if (!result.isValid) {
          return response.badRequest({ message: result.message })
        }
        fetchedCompanyName = result.company?.name
      }
    } else if (payload.accountType === 'individual') {
      recipientName = payload.firstName!
    }

    // 3. Open database transaction
    const trx = await db.transaction()

    try {
      // 4. Create the primary User
      const user = await User.create({
        email: payload.email,
        password: payload.password,
        accountType: payload.accountType,
      }, { client: trx })

      // 5. Save profile depending on the account type
      if (payload.accountType === 'individual') {
        await user.related('individualProfile').create({
          firstName: payload.firstName!,
          lastName: payload.lastName!,
          countryOfResidence: payload.countryOfResidence!,
        }, { client: trx })
        
      } else if (payload.accountType === 'business') {
        await user.related('businessProfile').create({
          businessRegulation: payload.fcaNumber ? 'regulated' : 'unregulated',
          representativeFullName: payload.representativeFullName!,
          businessName: fetchedCompanyName || payload.businessName!,
          countryOfOperations: payload.countryOfOperations!,
          fcaNumber: payload.fcaNumber || null,
          companiesHouseNumber: payload.companyNumber || null,
        }, { client: trx })
      }

      // Commit the database changes safely
      await trx.commit()

      // 6. Generate a Cryptographically Signed URL for email verification
      const SERVER_URL = env.get('SERVER_URL')

      const verificationUrl = router.makeSignedUrl(
        'auth.verify_email', 
        [user.id],      
        { 
          expiresIn: '24h',
          prefixUrl: SERVER_URL 
        }
      )

      // 7. Send the Verification Email
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Verify your Moneylot Plus Account')
          .htmlView('emails/verify_email', { 
            url: verificationUrl, 
            name: recipientName 
          })
      })

      return response.created({
        message: 'Account registered successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          accountType: user.accountType,
        },
      })

    } catch (error) {
      // Ensure transaction is ALWAYS rolled back if DB queries fail
      await trx.rollback()
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.internalServerError({
        message: 'Registration failed due to a server error.',
        error: errorMessage
      })
    }
  }

  async housenumber({ request, response }: HttpContext) {
    const { companyNumber } = request.only(['companyNumber'])

    if (!companyNumber) {
      return response.badRequest({ message: 'Company number is required' })
    }

    const result = await validateCompanyHouseNumber(companyNumber)

    if (!result.isValid) {
      return response.badRequest({ message: result.message })
    }

    return response.ok({
      message: 'Company validated successfully',
      name: result.company?.name,
      data: result.company,
    })
  }

  async firmreference({ request, response }: HttpContext) {
    const { firmReferenceNumber } = request.only(['firmReferenceNumber'])

    if (!firmReferenceNumber) {
      return response.badRequest({ message: 'Firm reference number is required' })
    }

    const result = await validateCompanyReferenceNumber(firmReferenceNumber)

    if (!result.isValid) {
      return response.badRequest({ message: result.message })
    }

    return response.ok({
      message: result.message ,
      status: result.status ,
      name: result.name,
      data: result.company,
    })
  }

}