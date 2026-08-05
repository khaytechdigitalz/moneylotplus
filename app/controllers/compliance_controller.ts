// app/controllers/personal_compliance_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { SumsubService } from '#services/sumsub_service'
import { knowledgeAssessmentService } from '#services/knowledge_assessment_service'
import logger from '@adonisjs/core/services/logger'
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
   * Get current compliance verification status for logged-in user
   */
  public async getStepThreeStatus({ auth, response }: HttpContext) {
    const user = auth.user!

    // 1. Fetch user profile based on account type
    let profile: any = null

    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }

    if (!profile) {
      return response.badRequest({ message: 'Profile not found' })
    }

    // 2. Check local DB first for fast response if already at step_4
    if (profile.complianceStep === 'step_4') {
      return response.ok({
        status: 'completed',
        isVerified: true,
      })
    }

    // 3. Query Sumsub directly for real-time status
    const statusData = await SumsubService.getApplicantStatus(user.id)

    // 4. Update local DB records based on real-time Sumsub response
    if (statusData.isApproved) {
      logger.info(`KYC Approved for User ID ${user.id} (${user.accountType})`)

      // Advance user profile to step_4
      profile.complianceStep = 'step_4'
      await profile.save()

      // Update Compliance Assessment table
      const complianceAssessment = await user.related('complianceAssessment').query().first()
      if (complianceAssessment) {
        complianceAssessment.identityVerificationId = statusData.applicantId
        complianceAssessment.identityVerificationStatus = 'approved'
        complianceAssessment.identityVerificationData = JSON.stringify(statusData)
        await complianceAssessment.save()
      }
    } else if (statusData.isRejected) {
      logger.warn(
        `KYC Rejected for User ID ${user.id} (${user.accountType}). Reject Labels: ${statusData.rejectLabels?.join(', ')}`
      )

      // Update Compliance Assessment table
      const complianceAssessment = await user.related('complianceAssessment').query().first()
      if (complianceAssessment) {
        complianceAssessment.identityVerificationId = statusData.applicantId
        complianceAssessment.identityVerificationStatus = 'rejected'
        complianceAssessment.identityVerificationData = JSON.stringify(statusData)
        await complianceAssessment.save()
      }
    }

    // 5. Return status object back to frontend
    return response.ok(statusData)
  }
  
}
