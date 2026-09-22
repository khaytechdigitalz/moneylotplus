// app/controllers/regulated_business_compliance_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import {
  complianceBusinessStepOneValidator,
  complianceStepTwoBusinessValidator,
  complianceStepFourValidator,
} from '#validators/compliance_validator'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'

// Corrected import paths
import UsersComplianceAssessment from '#models/users_compliance_assessment'
import UsersSettlementAccount from '#models/users_settlement_account'
import UserBusinessOwner from '#models/users_business_owner'
import UserComplianceDocument from '#models/users_compliance_documents'

export default class RegulatedBusinessComplianceController {
  /**
   * Submit Step 1 Compliance: Business Category & Nature
   */
  async submitStepOne({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const business = await user.related('businessProfile').query().firstOrFail()

    if (business.complianceStep !== 'step_1') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${business.complianceStep}` }],
      })
    }

    const payload = await request.validateUsing(complianceBusinessStepOneValidator)

    try {
      business.businessCategory = payload.business_category
      business.businessNature = payload.business_nature
      business.complianceStep = 'step_2'
      await business.save()

      return response.ok({
        success: true,
        message: 'Step 1 compliance information captured successfully.',
        nextStep: 'step_2',
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to process Step 1 business compliance')
      return response.internalServerError({
        errors: [{ message: 'Failed to update compliance details. Please try again.' }],
      })
    }
  }

  /**
   * Submit Step 2 Compliance: Regulated Business Eligibility & Documents
   */
  public async submitStepTwo({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const profile = await user.related('businessProfile').query().firstOrFail()

    if (profile.complianceStep !== 'step_2') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
      })
    }

    const payload = await request.validateUsing(complianceStepTwoBusinessValidator)

    const documentKeys = [
      { key: 'ceritifcate_of_incorporation', type: 'certificate_of_incorporation' },
      { key: 'certified_ownership_structure', type: 'ownership_structure' },
      { key: 'board_resolution', type: 'board_resolution' },
      { key: 'proof_of_address', type: 'proof_of_address' },
      { key: 'financial_statement', type: 'financial_statement' },
    ] as const

    const transaction = await db.transaction()

    try {
      const uploadPath = app.makePath('storage/compliance/documents')

      // Save files & records
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

      // Bulk insert beneficial owners
      if (payload.beneficial_owners?.length) {
        const ownersData = payload.beneficial_owners.map((owner) => ({
          userId: user.id,
          name: owner.name,
          dateOfBirth: owner.date_of_birth,
          basisOfControl: owner.basis_of_control,
        }))

        await UserBusinessOwner.createMany(ownersData, { client: transaction })
      }

      // Store/Update assessment metadata
      await UsersComplianceAssessment.updateOrCreate(
        { userId: user.id },
        {
          profileType: 'business',
          selectedServices: typeof payload.selectedServices === 'string'
            ? payload.selectedServices
            : JSON.stringify(payload.selectedServices),
          structure: payload.structure,
          assetsUnderManagement: payload.assets_under_management,
          investingAs: payload.investing_as || payload.investing_as,
        },
        { client: transaction }
      )

      // Update state
      profile.complianceStep = 'step_3'
      profile.useTransaction(transaction)
      await profile.save()

      await transaction.commit()

      return response.ok({
        success: true,
        message: 'Business eligibility, beneficial owners, and compliance documents stored successfully.',
        nextStep: 'step_3',
      })
    } catch (error) {
      await transaction.rollback()
      logger.error({ err: error }, 'Failed to process Step 2 business compliance')
      return response.internalServerError({
        errors: [{ message: 'Failed to process business compliance step two. Please try again.' }],
      })
    }
  }

  /**
   * Submit Step 4 (Services, Mandate, & Settlement Account)
   */
  public async submitStepFour({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(complianceStepFourValidator)

    const profile = await user.related('businessProfile').query().first()

    if (!profile) {
      return response.badRequest({ errors: [{ message: 'Business profile not found.' }] })
    }

    if (profile.complianceStep !== 'step_4') {
      return response.badRequest({
        errors: [{ message: `Action rejected. Current compliance requirement: ${profile.complianceStep}` }],
      })
    }

    const transaction = await db.transaction()

    try {
      // 1. Update compliance assessment
      await UsersComplianceAssessment.updateOrCreate(
        { userId: user.id },
        {
          servicesSettlements: JSON.stringify(payload.servicesAndSettlements),
          mandateProfiles: JSON.stringify(payload.mandateProfile),
        },
        { client: transaction }
      )

      // 2. Save or Update Settlement Account details
      await UsersSettlementAccount.updateOrCreate(
        { userId: user.id },
        {
          accountName: payload.settlementAccount.accountName,
          bankName: payload.settlementAccount.bankName,
          bankBranch: payload.settlementAccount.bankBranch || null,
          sortCodeSwiftBic: payload.settlementAccount.sortCodeSwiftBic,
          accountNumberIban: payload.settlementAccount.accountNumberIban,
          accountCurrency: payload.settlementAccount.accountCurrency,
        },
        { client: transaction }
      )

      // 3. Mark compliance step as completed
      profile.complianceStep = 'completed'
      profile.useTransaction(transaction)
      await profile.save()

      await transaction.commit()

      logger.info(`Step 4 compliance completed successfully for User ID: ${user.id}`)

      return response.ok({
        success: true,
        message: 'Services and settlement account saved successfully.',
        complianceStep: profile.complianceStep,
      })
    } catch (error) {
      await transaction.rollback()
      logger.error({ err: error }, 'Failed to process Step 4 compliance')
      return response.internalServerError({
        errors: [{ message: 'Failed to complete final compliance step. Please try again.' }],
      })
    }
  }
}