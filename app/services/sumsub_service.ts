import crypto from 'node:crypto'
import axios from 'axios'
import env from '#start/env'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export class SumsubService {
  /**
   * Generates a short-lived WebSDK access token via POST /resources/accessTokens/sdk
   */
  static async generateAccessToken(userId: number,levelNm: string): Promise<string> {
    const appToken = env.get('SUMSUB_APP_TOKEN').trim()
    const secretKey = env.get('SUMSUB_SECRET_KEY').trim()
    const levelName = levelNm
    const externalUserId = `user_${userId}`

    const timestamp = Math.floor(Date.now() / 1000)
    const method = 'POST'
    const url = '/resources/accessTokens/sdk'

    // JSON Payload
    const bodyObj = {
      userId: externalUserId,
      levelName: levelName,
      ttlInSecs: 600, // Token lifetime (10 minutes)
    }

    const jsonBody = JSON.stringify(bodyObj)

    // Calculate HMAC SHA256 Signature
    // Sumsub HMAC string for POST with body: timestamp + METHOD + url + jsonBody
    const signature = crypto.createHmac('sha256', secretKey)
    signature.update(timestamp + method + url + jsonBody)

    // Request against Sumsub API
    const response = await axios({
      method: 'POST',
      url: `https://api.sumsub.com${url}`,
      data: jsonBody,
      headers: {
        'X-App-Token': appToken,
        'X-App-Access-Sig': signature.digest('hex'),
        'X-App-Access-Ts': timestamp,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return response.data.token
  }


  /**
   * Processes incoming Sumsub webhook payload for Individual and Business accounts
   */
  static async handleWebhook(payload: any) {
    const { type, applicantId, externalUserId, reviewResult } = payload

    logger.info(`Received Sumsub Webhook [${type}] for user: ${externalUserId}`)

    // 1. Parse externalUserId (e.g., 'user_123')
    if (!externalUserId || !externalUserId.startsWith('user_')) {
      logger.warn(`Sumsub Webhook received with invalid externalUserId format: ${externalUserId}`)
      return
    }

    const userId = Number.parseInt(externalUserId.replace('user_', ''), 10)
    const user = await User.find(userId)

    if (!user) {
      logger.error(`User with ID ${userId} not found for Sumsub webhook applicant ${applicantId}`)
      return
    }

    // 2. Fetch profile based on user's account_type to advance compliance step
    let profile: any = null

    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }

    if (!profile) {
      logger.error(`Profile not found for User ID ${userId} with accountType ${user.accountType}`)
      return
    }

    // 3. Fetch or initialize the user's Compliance Assessment record
    const complianceAssessment = await user.related('complianceAssessment').query().first()

    // 4. Handle Applicant Review Events
    if (type === 'applicantReviewed') {
      const reviewAnswer = reviewResult?.reviewAnswer // 'GREEN' = Approved, 'RED' = Rejected

      if (reviewAnswer === 'GREEN') {
        logger.info(`KYC Approved for User ID ${userId} (${user.accountType})`)

        // Advance user's profile to step_4
        profile.complianceStep = 'step_4'
        await profile.save()

        // Update Compliance Assessment table
        if (complianceAssessment) {
          complianceAssessment.identityVerificationId = applicantId
          complianceAssessment.identityVerificationStatus = 'approved'
          complianceAssessment.identityVerificationData = JSON.stringify(payload)
          await complianceAssessment.save()
        }
      } else if (reviewAnswer === 'RED') {
        logger.warn(
          `KYC Rejected for User ID ${userId} (${user.accountType}). Reject Labels: ${reviewResult?.rejectLabels}`
        )

        await profile.save()

        // Update Compliance Assessment table
        if (complianceAssessment) {
          complianceAssessment.identityVerificationId = applicantId
          complianceAssessment.identityVerificationStatus = 'rejected'
          complianceAssessment.identityVerificationData = JSON.stringify(payload)
          await complianceAssessment.save()
        }
      }
    }

    // 5. Handle Pending / Action Required State
    if (type === 'applicantPending') {
      profile.kycStatus = 'pending'
      await profile.save()

      if (complianceAssessment) {
        complianceAssessment.identityVerificationId = applicantId
        complianceAssessment.identityVerificationStatus = 'pending'
        complianceAssessment.identityVerificationData = JSON.stringify(payload)
        await complianceAssessment.save()
      }
    }
  }
}