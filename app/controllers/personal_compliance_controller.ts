// app/controllers/personal_compliance_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { complianceStepOneValidator,complianceStepTwoIndividualValidator } from '#validators/compliance_validator' // Updated import name
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import UsersComplianceAssessment from '#models/users_compliance_assessment'
import { SumsubService } from '#services/sumsub_service'
import env from '#start/env'

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
   * Submit Step 2 Compliance: Eligibility & Services Questionnaire
  */
  async submitStepTwo({ auth, request, response }: HttpContext) {
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

    // 3. Extract uploaded files from the optional evidenceOfSale payload object
    const evidenceFiles = payload.evidenceOfSale || {}
    const tradingFrequencyProof = evidenceFiles.tradingFrequencyProof
    const portfolioSizeProof = evidenceFiles.portfolioSizeProof
    const professionalExperienceProof = evidenceFiles.professionalExperience

    // 4. Fintech Rule Enforcement: Check that at least two criteria proofs exist
    const documentBucket = [
      tradingFrequencyProof,
      portfolioSizeProof,
      professionalExperienceProof,
    ].filter(Boolean)
    
    if (documentBucket.length > 2) {
      return response.badRequest({
        errors: [{ message: 'Compliance rules dictate you must provide evidence for at least two separate criteria.' }],
      })
    }

    // 5. Spin up transaction boundary
    const transaction = await db.transaction()

    try {
      // 6. Handle file uploads to disk storage
      const uploadedDocsMap: Record<string, string> = {}
      const uploadPath = app.makePath('storage/compliance/document')

      if (tradingFrequencyProof) {
        await tradingFrequencyProof.move(uploadPath)
        if (tradingFrequencyProof.fileName) {
          uploadedDocsMap['tradingFrequencyProof'] = `compliance/document/${tradingFrequencyProof.fileName}`
        }
      }

      if (portfolioSizeProof) {
        await portfolioSizeProof.move(uploadPath)
        if (portfolioSizeProof.fileName) {
          uploadedDocsMap['portfolioSizeProof'] = `compliance/document/${portfolioSizeProof.fileName}`
        }
      }

      if (professionalExperienceProof) {
        await professionalExperienceProof.move(uploadPath)
        if (professionalExperienceProof.fileName) {
          uploadedDocsMap['professionalExperienceProof'] = `compliance/document/${professionalExperienceProof.fileName}`
        }
      }

      // 7. Save assessment using Lucid Model with individual columns
      await UsersComplianceAssessment.create(
        {
          userId: user.id,
          profileType: 'individual',
          selectedServices: payload.selectedServices,
          employmentDetails: payload.employmentDetails,
          investmentBackground: payload.investmentBackground,
          knowledgeAssessment: payload.knowledgeAnswers || null,
          evidenceOfSale: uploadedDocsMap,
        },
        { client: transaction }
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

  /**
   * Get WebSDK token for Step 3 Identity Verification
   */
  async getStepThreeToken({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const profile = await user.related('individualProfile').query().firstOrFail()

    // 1. Verify user is on Step 3
    if (profile.complianceStep !== 'step_3') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance step: ${profile.complianceStep}` }],
      })
    }

    try {
      // 2. Fetch token from Sumsub
      const levelName = env.get('SUMSUB_LEVEL_NAME_INDIVIDUAL').trim()
      const token = await SumsubService.generateAccessToken(user.id,levelName)

      return response.ok({
        success: true,
        token,
      })
   } catch (error: any) {
    // If the error came from Sumsub's API response
    if (error.response) {
      return response.status(error.response.status).json({
        success: false,
        status: error.response.status,
        sumsubError: error.response.data, // Shows Sumsub's exact error description & code
        message: error.message,
      })
    }

    // Generic fallback if it's a network error or missing key issue
    return response.internalServerError({
      success: false,
      errors: [{ message: error.message || 'Failed to generate identity verification session.' }],
    })
  }
  }

  /**
   * Renders the Step 3 Identity Verification (Sumsub WebSDK) page
   */
  async showStepThree({ auth, view }: HttpContext) {
    const user = auth.user!

    // 1. Fetch current profile based on account type
    let profile: any = null

    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }

    if (!profile) {
     // return response.redirect().toRoute('compliance.personal.step_one')
    }

    // Optional Guard: If user has already completed step_3 or beyond, redirect to step 4
    if (profile.complianceStep === 'step_4' || profile.complianceStep === 'completed') {
    //  return response.redirect().toRoute('compliance.step4')
    }

    // 2. Render step_3.edge view with user payload
    return view.render('compliance/step_3', {
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
      },
      profile: {
        complianceStep: profile.complianceStep,
        kycStatus: profile.kycStatus,
      },
    })
  }
}
