// app/controllers/personal_compliance_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { complianceStepOneValidator, complianceStepTwoIndividualValidator, complianceStepFourValidator } from '#validators/compliance_validator' // Updated import name
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import UsersComplianceAssessment from '#models/users_compliance_assessment'
import UsersSettlementAccount from '#models/users_settlement_account'
import UserComplianceDocument from '#models/user_compliance_document'


export default class PersonalComplianceController {

  /**
    * Submit Step 1 Compliance: Personal Information
   */
  async submitStepOne({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const profile = await user.related('individualProfile').query().firstOrFail()

    if (profile.complianceStep !== 'step_1') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }]
      })
    }

    // Use the newly renamed unified validator
    const payload = await request.validateUsing(complianceStepOneValidator)

    try {
      profile.phone = payload.phone
      profile.nationality = payload.nationality
      profile.countryOfBirth = payload.countryOfBirth
      user.otpTokenExpiresAt = payload.dateOfBirth
      profile.complianceStep = 'step_2'
      await profile.save()

      return response.ok({
        success: true,
        message: 'Step 1 compliance information captured successfully.',
        nextStep: 'step_2',
      })

    } catch (error) {
      return response.internalServerError({
        errors: [{ message: 'Failed to update compliance details. Please try again.' }]
      })
    }
  }

  /**
   * Submit Step 2 Compliance: Eligibility & Services Questionnaire (Individual)
   */
  async submitStepTwo({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const profile = await user.related('individualProfile').query().firstOrFail()

    // 1. Enforce strict sequential state checking
    if (profile.complianceStep !== 'step_2') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
      })
    }

    // 2. Validate payload
    const payload = await request.validateUsing(complianceStepTwoIndividualValidator)

    // 3. Define optional documents configuration
    const documentKeys = [
      { key: 'trading_frequency', type: 'trading_frequency' },
      { key: 'portfolio_size', type: 'portfolio_size' },
      { key: 'professional_experience', type: 'professional_experience' },
    ] as const

    // Optional rule check: Count provided files if business logic requires min 2 proofs
    const providedFiles = documentKeys
      .map((item) => payload[item.key as keyof typeof payload] as any)
      .filter((file) => file && file.isValid)

    if (providedFiles.length < 2) {
      return response.badRequest({
        errors: [{ message: 'Compliance rules dictate you must provide evidence for at least two separate criteria.' }],
      })
    }

    // 4. Spin up transaction boundary
    const transaction = await db.transaction()

    try {
      // 5. Save uploaded files to storage and insert into users_compliance_documents table
      const uploadPath = app.makePath('storage/compliance/documents')

      for (const item of documentKeys) {
        const file = payload[item.key as keyof typeof payload] as any

        if (file && file.isValid) {
          const fileName = `${Date.now()}_${file.clientName}`
          await file.move(uploadPath, { name: fileName })

          await UserComplianceDocument.create(
            {
              userId: user.id,
              documentType: item.type,
              document: `compliance/documents/${fileName}`,
            },
            { client: transaction }
          )
        }
      }

      // 6. Store or update assessment metadata in users_compliance_assessments table
      await UsersComplianceAssessment.updateOrCreate(
        { userId: user.id }, // Search criteria
        {
          profileType: 'individual',
          selectedServices: typeof payload.selectedServices === 'string'
            ? payload.selectedServices
            : JSON.stringify(payload.selectedServices),
          employmentDetails: payload.employmentDetails
            ? JSON.stringify(payload.employmentDetails)
            : null,
          investmentBackground: payload.investmentBackground
            ? JSON.stringify(payload.investmentBackground)
            : null,
          knowledgeAssessment: payload.knowledgeAnswers
            ? JSON.stringify(payload.knowledgeAnswers)
            : null,
        },
        { client: transaction } // Transaction options
      )

      // 7. Progress state machine mapping to Step 3
      profile.complianceStep = 'step_3'
      profile.useTransaction(transaction)
      await profile.save()

      // Commit transaction boundary
      await transaction.commit()

      return response.ok({
        success: true,
        message: 'Eligibility assessment details and document proofs captured successfully.',
        nextStep: 'step_3',
      })
    } catch (error) {
      // Rollback database transaction on error
      await transaction.rollback()
      return response.internalServerError({
        errors: [
          {
            message: 'Failed to process compliance step two information. Please try again.',
            error: error,
          },
        ],
      })
    }
  }

  /**
    * Submit Step 2 Compliance: Eligibility & Services Questionnaire
  
   async submitStepTwoOLD({ auth, request, response }: HttpContext) {
     const user = auth.getUserOrFail()
     const profile = await user.related('individualProfile').query().firstOrFail()
 
     // 1. Enforce strict sequential state checking
     if (profile.complianceStep !== 'step_2') {
       return response.badRequest({
         errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
       })
     }
 
     // 2. Validate payload matching restructured schema
     const payload = await request.validateUsing(complianceStepTwoIndividualValidator)
 
     // 3. Define optional documents configuration
     const documentKeys = [
       { key: 'trading_frequency', type: 'trading_frequency' },
       { key: 'portfolio_size', type: 'portfolio_size' },
       { key: 'professional_experience', type: 'professional_experience' },
     ] as const
 
        
     // 5. Spin up transaction boundary
     const transaction = await db.transaction()
 
     try {
         // 6. Save uploaded files to storage and insert into users_compliance_documents table
               const uploadPath = app.makePath('storage/compliance/documents')
 
               for (const item of documentKeys) {
                 const file = payload[item.key as keyof typeof payload] as any
         
                 if (file && file.isValid) {
                   const fileName = `${Date.now()}_${file.clientName}`
                   await file.move(uploadPath, { name: fileName })
         
                   await UserComplianceDocument.create(
                     {
                       userId: user.id,
                       documentType: item.type,
                       document: `compliance/documents/${fileName}`,
                     },
                     { client: transaction }
                   )
                 }
               }
         
 
       // 7. Store or update assessment metadata in users_compliance_assessments table
       await UsersComplianceAssessment.updateOrCreate(
         { userId: user.id }, // Search criteria
         {
           profileType: 'individual',
           selectedServices: payload.selectedServices,
           employmentDetails: payload.employmentDetails,
           investmentBackground: payload.investmentBackground,
           knowledgeAssessment: payload.knowledgeAnswers || null,
         },
         { client: transaction } // Transaction options
       )
 
       // 8. Progress state machine mapping to Step 3
       profile.complianceStep = 'step_3'
       profile.useTransaction(transaction)
       await profile.save()
 
       // Commit transaction boundary
       await transaction.commit()
 
       return response.ok({
         success: true,
         message: 'Eligibility assessment details and document proofs captured successfully.',
         nextStep: 'step_3',
       })
     } catch (error) {
       // Rollback database transaction on error
       await transaction.rollback()
       return response.internalServerError({
         errors: [{ message: 'Failed to process compliance step two information. Please try again.' }],
       })
     }
   }
    */

  /**
 * Submit Step 4 (Services, Mandate, & Settlement Account)
 */
  public async submitStepFour({ auth, request, response }: HttpContext) {
    const user = auth.user!

    // 1. Validate incoming form payload
    const payload = await request.validateUsing(complianceStepFourValidator)

    // 2. Fetch User Profile & Compliance Assessment
    let profile: any = null
    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }

    if (!profile) {
      return response.badRequest({ message: 'User profile not found.' })
    }


    if (profile.complianceStep !== 'step_4') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
      })
    }


    const complianceAssessment = await user
      .related('complianceAssessment')
      .query()
      .first()

    if (!complianceAssessment) {
      return response.badRequest({ message: 'Compliance assessment record not found.' })
    }

    // 3. Save JSON columns in users_compliance_assessments table
    complianceAssessment.servicesSettlements = JSON.stringify(payload.servicesAndSettlements)
    complianceAssessment.mandateProfiles = JSON.stringify(payload.mandateProfile)
    await complianceAssessment.save()

    // 4. Save or Update Settlement Account details in users_settlement_accounts table
    await UsersSettlementAccount.updateOrCreate(
      { userId: user.id },
      {
        accountName: payload.settlementAccount.accountName,
        bankName: payload.settlementAccount.bankName,
        bankBranch: payload.settlementAccount.bankBranch || null,
        sortCodeSwiftBic: payload.settlementAccount.sortCodeSwiftBic,
        accountNumberIban: payload.settlementAccount.accountNumberIban,
        accountCurrency: payload.settlementAccount.accountCurrency,
      }
    )

    // 5. Update user profile compliance step to completed 
    profile.complianceStep = 'completed'
    await profile.save()

    logger.info(`Step 4 compliance completed successfully for User ID: ${user.id}`)

    return response.ok({
      message: 'Services and settlement account saved successfully.',
      complianceStep: profile.complianceStep,
    })
  }




}
