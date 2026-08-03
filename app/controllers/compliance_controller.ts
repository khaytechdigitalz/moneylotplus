// app/controllers/personal_compliance_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { SumsubService } from '#services/sumsub_service'
import { knowledgeAssessmentService } from '#services/knowledge_assessment_service'
import env from '#start/env'

export default class ComplianceController {
  

  /**
   * Get WebSDK token for Step 3 Identity Verification
   */
  async getSumSubToken({ auth, response }: HttpContext) {
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
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
        },
        token,
      });
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
   * Get Knowledge Assessment library
   */
  async getKAQuestion({ auth, response }: HttpContext) {
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
      const qa = await knowledgeAssessmentService.KnowledgeAssessment()

      return response.ok({
        success: true,
        qa,
      })
   } catch (error: any) {
    // If the error came from Sumsub's API response
    if (error.response) {
      return response.status(error.response.status).json({
        success: false,
        message:  'Error fetching knowledge assessment question library',
      })
    }

    // Generic fallback if it's a network error or missing key issue
    return response.internalServerError({
      success: false,
      errors: [ 'Failed to generate knowdlege assessment library.' ],
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
