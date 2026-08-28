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
   * Submit Step 1 Compliance: Individual Personal Information & Address Details
   */
  async submitStepOne({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const profile = await user.related('individualProfile').query().firstOrFail()

    // 1. Enforce strict state checking
    if (profile.complianceStep !== 'step_1') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
      })
    }

    // 2. Validate request payload against VineJS schema
    const payload = await request.validateUsing(complianceStepOneValidator)

    try {
      // 3. Assign Personal Details
      profile.phone = payload.phone
      profile.nationality = payload.nationality
      profile.countryOfBirth = payload.countryOfBirth
      profile.dateOfBirth = payload.dateOfBirth
      profile.maritalStatus = payload.maritalStatus || null
      profile.dependants = payload.dependants || payload.Dependant || null

      // 4. Assign Primary Address Details
      profile.addressLine1 = payload.address_line1 || null
      profile.addressLine2 = payload.address_line2 || null
      profile.postalCode = payload.postalcode || null
      profile.city = payload.city || null
      profile.country = payload.country || null
      if (payload.countryOfResidence) {
        profile.countryOfResidence = payload.countryOfResidence
      }

      // 5. Assign Mailing Address Details
      profile.mailingAddressLine1 = payload.mailing_address_line1 || null
      profile.mailingAddressLine2 = payload.mailing_address_line2 || null

      // 6. Assign Residential Address Details
      profile.residentialAddressLine1 = payload.residential_address_line1 || null
      profile.residentialAddressLine2 = payload.residential_address_line2 || null
      profile.residentialPostalCode = payload.residential_postalcode || null
      profile.residentialCity = payload.residential_city || null
      profile.residentialCountry = payload.residential_country || null

      // 7. Advance state machine to Step 2 & Save
      profile.complianceStep = 'step_2'
      await profile.save()

      return response.ok({
        success: true,
        message: 'Step 1 compliance information captured successfully.',
        nextStep: 'step_2',
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to process Step 1 individual compliance')
      return response.internalServerError({
        errors: [{ message: 'Failed to update compliance details. Please try again.' }],
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

    // 3. Define document file mappings matching payload structure
    const documentFiles = [
      {
        file: payload.Proof_of_invesetment,
        type: payload.Proof_of_invesetment_type || 'Proof of Investment',
        category: 'proof_of_investment',
      },
      {
        file: payload.professional_experience,
        type: payload.professional_experience_type || 'Professional Experience',
        category: 'professional_experience',
      },
    ]

    // Filter valid files present in the upload
    const activeUploads = documentFiles.filter((item) => item.file && item.file.isValid)

    // Optional Business Rule: Check if minimum proof requirements are met (uncomment if enforced)
    /*
    if (activeUploads.length < 1) {
      return response.badRequest({
        errors: [{ message: 'Please attach at least one document proof to proceed.' }],
      })
    }
    */

    // 4. Spin up database transaction
    const transaction = await db.transaction()

    try {
      // 5. Save uploaded files to storage and insert records into users_compliance_documents table
      const uploadPath = app.makePath('storage/compliance/documents')

      for (const item of activeUploads) {
        const file = item.file!
        const fileName = `${Date.now()}_${user.id}_${item.category}.${file.extname}`
        
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

      // 6. Store or update assessment metadata in users_compliance_assessments table
      await UsersComplianceAssessment.updateOrCreate(
        { userId: user.id },
        {
          profileType: 'individual',
          selectedServices: JSON.stringify(payload.selectedServices),
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
        { client: transaction }
      )

      // 7. Progress state machine mapping to Step 3
      profile.complianceStep = 'step_3'
      profile.useTransaction(transaction)
      await profile.save()

      // Commit database transaction boundary
      await transaction.commit()

      return response.ok({
        success: true,
        message: 'Eligibility assessment details and document proofs captured successfully.',
        nextStep: 'step_3',
      })
    } catch (error) {
      // Rollback database transaction on error
      await transaction.rollback()
      logger.error({ err: error }, 'Failed to process Step 2 individual compliance')

      return response.internalServerError({
        errors: [{ message: 'Failed to process compliance step two information. Please try again.' }],
      })
    }
  }

  
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
    profile.complianceStep = 'acknowledgement'
    await profile.save()

    logger.info(`Step 4 compliance completed successfully for User ID: ${user.id}`)

    return response.ok({
      message: 'Services and settlement account saved successfully.',
      complianceStep: profile.complianceStep,
    })
  }

  /**
   * Submit Step Acknowledgement (6 Agreements/Declarations)
   */
  public async submitStepAcknowledgement({ auth, request, response }: HttpContext) {
    const user = auth.user!

    // 1. Extract payload directly (no validator service)
    const body = request.all()
    const acknowledgments = body.acknowledgments || body

    // 2. Define the exact 6 required checkboxes
    const requiredKeys = [
      'riskDisclosure',
      'termsAndConditions',
      'privacyPolicy',
      'orderExecutionPolicy',
      'conflictsOfInterestPolicy',
      'feeScheduleAgreement',
    ]

    // 3. Verify all 6 items are present and evaluated to true
    const unacceptedKeys = requiredKeys.filter(
      (key) => acknowledgments[key] !== true && acknowledgments[key] !== 'true' && acknowledgments[key] !== 1
    )

    if (unacceptedKeys.length > 0) {
      return response.badRequest({
        errors: [
          {
            message: `You must accept all required terms to complete registration. Missing/Unchecked: ${unacceptedKeys.join(', ')}`,
          },
        ],
      })
    }

    // 4. Fetch User Profile (Individual or Business)
    let profile: any = null
    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }

    if (!profile) {
      return response.badRequest({
        errors: [{ message: 'User profile not found.' }],
      })
    }

    // 5. Enforce state checking
    if (profile.complianceStep !== 'acknowledgement') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance step requirement: ${profile.complianceStep}` }],
      })
    }

    try {
      // 6. Update profile compliance step to 'completed'
      profile.complianceStep = 'completed'
      await profile.save()

      logger.info(`Compliance successfully completed for User ID: ${user.id}`)

      return response.ok({
        success: true,
        message: 'Compliance acknowledgements accepted and status updated to completed.',
        complianceStep: profile.complianceStep,
      })
    } catch (error) {
      logger.error({ err: error }, `Failed to submit step acknowledgement for User ID: ${user.id}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to process compliance acknowledgement. Please try again later.' }],
      })
    }
  }
  




}
