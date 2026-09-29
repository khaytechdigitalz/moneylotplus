import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserComplianceDocument from '#models/users_compliance_documents'
import UsersSettlementAccount from '#models/users_settlement_account'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import { logAudit } from '#services/audit_service'
import mail from '@adonisjs/mail/services/main'

export default class AdminComplianceController {
  /**
   * Get Compliance Dashboard Overview & Paginated Customer List
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const statusFilter = request.input('status') || request.input('complianceStatus') // Handles 'pending', 'approved', 'declined'
    const searchQuery = request.input('search')

    // Time filter inputs: 'today' | 'yesterday' | '7days' | '30days' | 'custom'
    const period = request.input('period')
    const fromDateInput = request.input('fromDate') // Format: YYYY-MM-DD
    const toDateInput = request.input('toDate') // Format: YYYY-MM-DD

    try {
      // 1. Resolve Start & End Date Boundaries using Luxon
      let startDate: DateTime | null = null
      let endDate: DateTime | null = null

      const now = DateTime.now()

      if (period === 'today') {
        startDate = now.startOf('day')
        endDate = now.endOf('day')
      } else if (period === 'yesterday') {
        const yesterday = now.minus({ days: 1 })
        startDate = yesterday.startOf('day')
        endDate = yesterday.endOf('day')
      } else if (period === '7days') {
        startDate = now.minus({ days: 7 }).startOf('day')
        endDate = now.endOf('day')
      } else if (period === '30days') {
        startDate = now.minus({ days: 30 }).startOf('day')
        endDate = now.endOf('day')
      } else if (period === 'custom' || (fromDateInput && toDateInput)) {
        if (fromDateInput) {
          startDate = DateTime.fromISO(fromDateInput).startOf('day')
        }
        if (toDateInput) {
          endDate = DateTime.fromISO(toDateInput).endOf('day')
        }
      }

      // Helper function to apply date range filter to a query
      const applyDateFilter = (query: any) => {
        if (startDate && startDate.isValid) {
          query.where('createdAt', '>=', startDate.toSQL()!)
        }
        if (endDate && endDate.isValid) {
          query.where('createdAt', '<=', endDate.toSQL()!)
        }
      }

      // 2. Calculate Summary KPI Aggregates strictly for role = 'customer' with Date Filters
      const [totalCount, pendingCount, approvedCount, declinedCount] = await Promise.all([
        // Total Registered Customers
        User.query().where('role', 'customer').if(true, applyDateFilter).count('* as total'),

        // Pending Approval Users
        User.query()
          .where('role', 'customer')
          .if(true, applyDateFilter)
          .where((q) => {
            q.whereHas('individualProfile', (ip) => {
              ip.where('complianceStatus', 'pending')
            }).orWhereHas('businessProfile', (bp) => {
              bp.where('complianceStatus', 'pending')
            })
          })
          .count('* as total'),

        // Approved KYC Users
        User.query()
          .where('role', 'customer')
          .if(true, applyDateFilter)
          .where((q) => {
            q.whereHas('individualProfile', (ip) => {
              ip.where('complianceStatus', 'approved')
            }).orWhereHas('businessProfile', (bp) => {
              bp.where('complianceStatus', 'approved')
            })
          })
          .count('* as total'),

        // Declined KYC Users
        User.query()
          .where('role', 'customer')
          .if(true, applyDateFilter)
          .where((q) => {
            q.whereHas('individualProfile', (ip) => {
              ip.where('complianceStatus', 'declined')
            }).orWhereHas('businessProfile', (bp) => {
              bp.where('complianceStatus', 'declined')
            })
          })
          .count('* as total'),
      ])

      // 3. Build Query for Customer List
      const usersQuery = User.query()
        .where('role', 'customer')
        .preload('individualProfile', (profileQuery) => {
          profileQuery.select(['firstName', 'lastName', 'complianceStatus'])
        })
        .preload('businessProfile', (businessQuery) => {
          businessQuery.select(['businessName', 'representativeFullName', 'complianceStatus'])
        })

      // Apply Date Filter to Customer List Query
      applyDateFilter(usersQuery)

      // Optional status filter against relationship profiles
      if (statusFilter) {
        usersQuery.where((q) => {
          q.whereHas('individualProfile', (ip) => {
            ip.where('complianceStatus', statusFilter)
          }).orWhereHas('businessProfile', (bp) => {
            bp.where('complianceStatus', statusFilter)
          })
        })
      }

      // Optional search query by name or email
      if (searchQuery) {
        usersQuery.where((query) => {
          query
            .whereILike('email', `%${searchQuery}%`)
            .orWhereHas('individualProfile', (profile) => {
              profile
                .whereILike('firstName', `%${searchQuery}%`)
                .orWhereILike('lastName', `%${searchQuery}%`)
            })
            .orWhereHas('businessProfile', (business) => {
              business
                .whereILike('businessName', `%${searchQuery}%`)
                .orWhereILike('representativeFullName', `%${searchQuery}%`)
            })
        })
      }

      // Fetch paginated customer records
      const paginatedUsers = await usersQuery.orderBy('createdAt', 'desc').paginate(page, limit)

      // 4. Transform Records
      const userRecords = paginatedUsers.all().map((user: User) => {
        let name = 'N/A'
        let kycStatus = 'pending'

        if (user.accountType === 'individual' && user.individualProfile) {
          name =
            `${user.individualProfile.firstName || ''} ${user.individualProfile.lastName || ''}`.trim()
          kycStatus = user.individualProfile.complianceStatus || 'pending'
        } else if (user.accountType === 'business' && user.businessProfile) {
          name = user.businessProfile.businessName || 'N/A'
          kycStatus = user.businessProfile.complianceStatus || 'pending'
        }

        return {
          id: user.id,
          name: name || user.email,
          email: user.email,
          type: user.accountType,
          kyc_status: kycStatus,
          updated_at: user.updatedAt ? user.updatedAt.toISO() : null,
          created_at: user.createdAt ? user.createdAt.toISO() : null,
        }
      })

      // 5. Return Structured Response
      return response.ok({
        success: true,
        summary: {
          total_registered_customers: Number(totalCount[0].$extras.total || 0),
          pending_approval_users: Number(pendingCount[0].$extras.total || 0),
          approved_kyc_users: Number(approvedCount[0].$extras.total || 0),
          rejected_kyc_users: Number(declinedCount[0].$extras.total || 0),
        },
        data: userRecords,
        pagination: {
          total: paginatedUsers.total,
          per_page: paginatedUsers.perPage,
          current_page: paginatedUsers.currentPage,
          last_page: paginatedUsers.lastPage,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, page, limit, statusFilter, searchQuery, period, fromDateInput, toDateInput },
        `Failed to retrieve admin compliance dashboard records: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [
          {
            message: 'Failed to retrieve compliance dashboard records. Please try again.',
          },
        ],
      })
    }
  }

  /**
   * Get Account Information Details for a Specific Customer by ID
   */
  async show({ params, response }: HttpContext) {
    const userId = params.id

    try {
      // 1. Fetch User with Profile Relationships
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      // 2. Extract Profile Details based on Account Type
      const isIndividual = user.accountType === 'individual'
      const individual = user.individualProfile
      const business = user.businessProfile

      const complianceStatus = isIndividual
        ? individual?.complianceStatus || 'pending'
        : business?.complianceStatus || 'pending'

      // 3. Structure Account Information dynamically matching Model columns
      const accountInformation = {
        complianceStatus,
        details: isIndividual
          ? {
              firstName: individual?.firstName || null,
              lastName: individual?.lastName || null,
              email: user.email,
              phone: individual?.phone || individual.phone || null,
              dateOfBirth: individual?.dateOfBirth
                ? typeof individual.dateOfBirth === 'string'
                  ? individual.dateOfBirth
                  : individual.dateOfBirth.toISODate()
                : null,
              maritalStatus: individual?.maritalStatus || null,
              countryOfBirth: individual?.countryOfBirth || null,
              nationality: individual?.nationality || null,
              countryOfResidence: individual?.countryOfResidence || null,
              numberOfDependents: individual?.dependants || null,
            }
          : {
              representativeFullName: business?.representativeFullName || null,
              businessName: business?.businessName || null,
              email: user.email,
              phone: null,
              businessCategory: business?.businessCategory || null,
              businessNature: business?.businessNature || null,
              businessRegulation: business?.businessRegulation || null,
              countryOfOperations: business?.countryOfOperations || null,
              fcaNumber: business?.fcaNumber || null,
              companiesHouseNumber: business?.companiesHouseNumber || null,
            },
        addressInformation: isIndividual
          ? {
              addressLine1: individual?.addressLine1 || null,
              addressLine2: individual?.addressLine2 || null,
              postalCode: individual?.postalCode || null,
              city: individual?.city || null,
              country: individual?.country || null,
            }
          : {
              countryOfOperations: business?.countryOfOperations || null,
            },
        residentialAddress: isIndividual
          ? {
              addressLine1: individual?.residentialAddressLine1 || null,
              addressLine2: individual?.residentialAddressLine2 || null,
              postalCode: individual?.residentialPostalCode || null,
              city: individual?.residentialCity || null,
              country: individual?.residentialCountry || null,
            }
          : null,
        mailingAddress: isIndividual
          ? {
              addressLine1: individual?.mailingAddressLine1 || individual?.addressLine1 || null,
              addressLine2: individual?.mailingAddressLine2 || individual?.addressLine2 || null,
            }
          : null,
      }

      // 4. Return Formatted Response
      return response.ok({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            accountType: user.accountType,
            role: user.role,
            status: user.status,
            complianceStatus,
            complianceStep: isIndividual ? individual?.complianceStep : business?.complianceStep,
            createdAt: user.createdAt ? user.createdAt.toISO() : null,
            updatedAt: user.updatedAt ? user.updatedAt.toISO() : null,
          },
          accountInformation,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId },
        `Failed to retrieve account information for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve customer account information. Please try again.' }],
      })
    }
  }

  /**
   * Get Eligibility & Services Tab Details for a Specific Customer by ID
   */
  async getEligibilityAndServices({ params, response }: HttpContext) {
    const userId = params.id

    try {
      // 1. Fetch User with Compliance Assessment & Profiles
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .preload('complianceAssessment')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile
      const assessment = user.complianceAssessment

      if (!assessment) {
        return response.ok({
          success: true,
          data: {
            userId: user.id,
            complianceStatus: profile?.complianceStatus || 'pending',
            eligibilityAndServices: null,
          },
        })
      }

      // 2. Parse JSON Fields Safely
      const selectedServices = this.safeJsonParse(assessment.selectedServices) || []
      const employment = this.safeJsonParse(assessment.employmentDetails) || {}
      const pep = this.safeJsonParse(assessment.pepDeclaration) || {}
      const investment = this.safeJsonParse(assessment.investmentBackground) || {}
      const tax = this.safeJsonParse(assessment.taxInformation) || {}
      const mandate = this.safeJsonParse(assessment.mandateProfiles) || {}

      // 3. Construct Eligibility & Services Data Structure
      const eligibilityAndServices = {
        complianceStatus: profile?.complianceStatus || 'pending',

        // Section 1: Selected Services
        services: Array.isArray(selectedServices) ? selectedServices.join(', ') : selectedServices,

        // Section 2: Employment Details & Financial Profile
        employmentDetails: {
          employmentStatus: employment.employmentStatus || employment.status || 'N/A',
          employerName: employment.employerName || employment.employer || 'N/A',
          businessCategory: employment.businessCategory || employment.business_category || 'N/A',
          occupation: employment.occupation || 'N/A',
          annualNetIncome: employment.annualNetIncome || employment.annualIncome || 'N/A',
          investmentPortfolio: employment.investmentPortfolio || 'N/A',
          netWorth: employment.netWorth || 'N/A',
          liquidNetWorth: employment.liquidNetWorth || 'N/A',
        },

        // Section 3: PEP Declaration
        pepDeclaration: {
          pepStatus: pep.pepStatus || 'No Match Found',
          positionHeld: pep.positionHeld || 'N/A',
          riskLevel: pep.riskLevel || 'Low',
        },

        // Section 4: Investment Background & Experience
        investmentBackground: {
          yearsOfActiveInvesting:
            investment.yearsOfActiveInvesting || investment.yearsActiveInvesting || 'N/A',
          typicalTransactionSize: investment.typicalTransactionSize || 'N/A',
          numberOfTradesPerYear:
            investment.numberOfTradesPerYear || investment.tradesPerYear || 'N/A',
          marketsTradedIn: investment.marketsTradedIn || investment.marketYouTraded || 'N/A',
          previousProfessionalRoles:
            investment.previousProfessionalRoles || investment.professionalRoleInFinance || 'N/A',
          knowledgeAssessmentScore: investment.knowledgeAssessmentScore
            ? `${investment.knowledgeAssessmentScore}%`
            : 'N/A',
          sourceOfFunds: investment.sourceOfFunds || 'N/A',
        },

        // Section 5: Tax Information
        taxInformation: {
          taxResidency: tax.taxResidency || tax.countryOfTaxResidency || 'N/A',
          taxIdentificationNumber: tax.taxIdentificationNumber || tax.tin || 'N/A',
        },

        // Section 6: Mandate Profile
        mandateProfile: {
          investmentObjective: mandate.investmentObjective || 'N/A',
          investmentHorizon: mandate.investmentHorizon || 'N/A',
          riskTolerance: mandate.riskTolerance || 'N/A',
          capacityForLoss: mandate.capacityForLoss || 'N/A',
          liquidityNeedFromPortfolio: mandate.liquidityNeedFromPortfolio || 'N/A',
          investmentPreference: mandate.investmentPreference || 'N/A',
        },
      }

      // 4. Return Structured Payload
      return response.ok({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          accountType: user.accountType,
          eligibilityAndServices,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId },
        `Failed to retrieve eligibility and services for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [
          { message: 'Failed to retrieve eligibility and services details. Please try again.' },
        ],
      })
    }
  }

  /**
   * Get Identity Verification & Uploaded Documents for a Specific Customer by ID
   */
  async getIdentityVerification({ params, response }: HttpContext) {
    const userId = params.id

    try {
      // 1. Fetch User with Profiles
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      // 2. Fetch all Compliance Documents for the user
      const documents = await UserComplianceDocument.query()
        .where('userId', userId)
        .orderBy('createdAt', 'desc')

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile
      const complianceStatus = profile?.complianceStatus || 'pending'

      // Categories matching Identity Verification core types vs Other Documents
      const identityVerificationTypes = [
        'liveness_check',
        'selfie',
        'valid_id',
        'nin',
        'passport',
        'drivers_license',
        'proof_of_address',
        'utility_bill',
        'bank_statement',
      ]

      // Helper function to format document object for UI cards
      const formatDocumentCard = (doc: UserComplianceDocument) => {
        const rawFileName = doc.document ? doc.document.split('/').pop() || doc.document : 'Document'
        
        return {
          id: doc.id,
          categoryLabel: this.formatCategoryLabel(doc.documentType), // e.g. "Liveness Check", "Valid ID"
          fileName: rawFileName,
          documentType: doc.documentType,
          fileUrl: doc.document,
          fileSize: '34KB', // Replace with dynamic file size service if available
          addedAt: doc.createdAt ? doc.createdAt.toFormat('FFFFa') : null, // e.g., "Monday, 24 Jun, 2024"
        }
      }

      // 3. Separate into Identity Verification & Others
      const identityVerificationDocs: any[] = []
      const otherDocs: any[] = []

      documents.forEach((doc) => {
        const normalizedType = doc.documentType?.toLowerCase() || ''
        const formattedDoc = formatDocumentCard(doc)

        if (identityVerificationTypes.some((type) => normalizedType.includes(type))) {
          identityVerificationDocs.push(formattedDoc)
        } else {
          otherDocs.push(formattedDoc)
        }
      })

      // 4. Return Structured Payload
      return response.ok({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          complianceStatus,
          identityVerification: identityVerificationDocs,
          otherDocuments: otherDocs,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId },
        `Failed to retrieve identity verification documents for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve uploaded documents. Please try again.' }],
      })
    }
  }

  /**
   * Get Settlement Account Details for a Specific Customer by ID
   */
  async getSettlementAccount({ params, response }: HttpContext) {
    const userId = params.id

    try {
      // 1. Fetch User with Profiles
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      // 2. Fetch User's Settlement Account Record
      const settlementAccount = await UsersSettlementAccount.query()
        .where('userId', userId)
        .first()

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile
      const complianceStatus = profile?.complianceStatus || 'pending'

      if (!settlementAccount) {
        return response.ok({
          success: true,
          data: {
            userId: user.id,
            email: user.email,
            complianceStatus,
            settlementAccount: null,
          },
        })
      }

      // 3. Format Settlement Account details matching UI UI layout
      const formattedAccount = {
        id: settlementAccount.id,
        accountName: settlementAccount.accountName || 'N/A',
        bankName: settlementAccount.bankName || 'N/A',
        bankBranch: settlementAccount.bankBranch || 'N/A',
        sortCodeSwiftBic: settlementAccount.sortCodeSwiftBic || 'N/A',
        accountNumberIban: settlementAccount.accountNumberIban || 'N/A',
        accountCurrency: settlementAccount.accountCurrency || 'N/A',
        createdAt: settlementAccount.createdAt ? settlementAccount.createdAt.toISO() : null,
        updatedAt: settlementAccount.updatedAt ? settlementAccount.updatedAt.toISO() : null,
      }

      // 4. Return Structured Payload
      return response.ok({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          complianceStatus,
          settlementAccount: formattedAccount,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId },
        `Failed to retrieve settlement account for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve settlement account details. Please try again.' }],
      })
    }
  }

  /**
   * 1. Approve Customer Compliance Status
   */
  async approve(ctx: HttpContext) {
    const { auth,  params, request, response } = ctx
  
    const userId = params.id
    const otp = request.input('otp')
    if (!otp || otp.trim() === '') {
      return response.badRequest({
        errors: [{ message: 'Please enter OTP.' }],
      })
    }
    const admin = auth.user! as User
    if (
      !admin.otpToken ||
      admin.otpToken !== otp ||
      !admin.otpTokenExpiresAt ||
      admin.otpTokenExpiresAt < DateTime.now()
    ) {
      return response.badRequest({ errors: [{ message: 'Invalid or expired OTP.' }] })
    }

    try {
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile

      if (!profile) {
        return response.badRequest({
          errors: [{ message: 'User profile does not exist.' }],
        })
      }

      const oldStatus = profile.complianceStatus
      const entityTableName = isIndividual ? 'users_individual_profiles' : 'users_business_profiles'

      // Update Compliance Status to 'approved'
      profile.complianceStatus = 'approved'
      await profile.save()

      // Record Audit Log
      await logAudit(ctx, {
        action: 'APPROVE_CUSTOMER_COMPLIANCE',
        entity: entityTableName,
        entityId: profile.id,
        oldValues: { complianceStatus: oldStatus },
        newValues: { complianceStatus: profile.complianceStatus },
      })

       admin.otpToken = null
       admin.otpTokenExpiresAt = null
       await admin.save()
    
      return response.ok({
        success: true,
        message: 'Customer compliance status approved successfully.',
        data: {
          userId: user.id,
          accountType: user.accountType,
          complianceStatus: profile.complianceStatus,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId },
        `Failed to approve compliance for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to approve customer compliance status.' }],
      })
    }
  }

  /**
   * 2. Reject Customer Compliance Status with Reason
   */
  async reject(ctx: HttpContext) {
    const { auth, params, request, response } = ctx
    const userId = params.id
    const reason = request.input('reason') || request.input('rejectionReason')
    const otp = request.input('otp')
    if (!otp || otp.trim() === '') {
      return response.badRequest({
        errors: [{ message: 'Please enter OTP.' }],
      })
    }

     const admin = auth.user! as User
    if (
      !admin.otpToken ||
      admin.otpToken !== otp ||
      !admin.otpTokenExpiresAt ||
      admin.otpTokenExpiresAt < DateTime.now()
    ) {
      return response.badRequest({ errors: [{ message: 'Invalid or expired OTP.' }] })
    }

    if (!reason || reason.trim() === '') {
      return response.badRequest({
        errors: [{ message: 'Rejection reason is required.' }],
      })
    }

    try {
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile

      if (!profile) {
        return response.badRequest({
          errors: [{ message: 'User profile does not exist.' }],
        })
      }

      const oldStatus = profile.complianceStatus
      const oldNote = (profile as any).complianceNote || null
      const entityTableName = isIndividual ? 'users_individual_profiles' : 'users_business_profiles'

      // Update Compliance Status to 'declined' and save note
      profile.complianceStatus = 'declined'
      ;(profile as any).complianceNote = reason.trim()
      await profile.save()

      // Record Audit Log
      await logAudit(ctx, {
        action: 'REJECT_CUSTOMER_COMPLIANCE',
        entity: entityTableName,
        entityId: profile.id,
        oldValues: { complianceStatus: oldStatus, complianceNote: oldNote },
        newValues: {
          complianceStatus: profile.complianceStatus,
          complianceNote: (profile as any).complianceNote,
        },
      })

       admin.otpToken = null
       admin.otpTokenExpiresAt = null
       await admin.save()
       
      return response.ok({
        success: true,
        message: 'Customer compliance status has been rejected.',
        data: {
          userId: user.id,
          accountType: user.accountType,
          complianceStatus: profile.complianceStatus,
          complianceNote: (profile as any).complianceNote,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId, reason },
        `Failed to reject compliance for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to reject customer compliance status.' }],
      })
    }
  }

  /**
   * 3. Request Specific Document(s) from Customer
   */
  async requestDocument(ctx: HttpContext) {
    const { params, request, response } = ctx
    const userId = params.id
    // Expected payload array e.g., ["Liveness Check", "Valid means of Identification", "Proof of Address"]
    const requestedDocuments = request.input('documents', []) 
    const customNote = request.input('note')

    if (!Array.isArray(requestedDocuments) || requestedDocuments.length === 0) {
      return response.badRequest({
        errors: [{ message: 'Please select at least one document to request.' }],
      })
    }

    try {
      const user = await User.query()
        .where('id', userId)
        .where('role', 'customer')
        .preload('individualProfile')
        .preload('businessProfile')
        .first()

      if (!user) {
        return response.notFound({
          errors: [{ message: 'Customer account not found.' }],
        })
      }

      const isIndividual = user.accountType === 'individual'
      const profile = isIndividual ? user.individualProfile : user.businessProfile

      if (!profile) {
        return response.badRequest({
          errors: [{ message: 'User profile does not exist.' }],
        })
      }

      const oldStatus = profile.complianceStatus
      const oldNote = (profile as any).complianceNote || null
      const entityTableName = isIndividual ? 'users_individual_profiles' : 'users_business_profiles'

      // Format requested document instructions
      const docRequestSummary = `Requested Document(s): ${requestedDocuments.join(', ')}.${customNote ? ` Note: ${customNote}` : ''}`

      // Keep or revert status to 'pending' and attach request note
      profile.complianceStatus = 'pending'
      ;(profile as any).complianceNote = docRequestSummary
      await profile.save()

      // Record Audit Log
      await logAudit(ctx, {
        action: 'REQUEST_CUSTOMER_COMPLIANCE_DOCUMENTS',
        entity: entityTableName,
        entityId: profile.id,
        oldValues: { complianceStatus: oldStatus, complianceNote: oldNote },
        newValues: {
          requestedDocuments,
          complianceStatus: profile.complianceStatus,
          complianceNote: (profile as any).complianceNote,
        },
      })

      return response.ok({
        success: true,
        message: 'Document request sent successfully to customer.',
        data: {
          userId: user.id,
          requestedDocuments,
          complianceStatus: profile.complianceStatus,
          complianceNote: (profile as any).complianceNote,
        },
      })
    } catch (error: any) {
      logger.error(
        { err: error, userId, requestedDocuments },
        `Failed to request documents for user ID ${userId}: ${error?.message || error}`
      )

      return response.internalServerError({
        errors: [{ message: 'Failed to submit document request.' }],
      })
    }
  }
 
  /**
   * Compliance Status Update- Send OTP
   */
    async sendComplianceOtp(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.user! as User
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otpToken = otp
    user.otpTokenExpiresAt = DateTime.now().plus({ minutes: 15 })
    await user.save()

    try {
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Compliance Status Update OTP')
          .htmlView('emails/admin_compliance_otp', { otp })
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to send admin password reset email')
    }

    return response.ok({
      success: true,
      message: 'Action OTO sent to your email.',
    })
  }


  /**
   * Helper to format raw document types to clean UI display labels
   */
  private formatCategoryLabel(documentType: string): string {
    if (!documentType) return 'Document'

    const typeLower = documentType.toLowerCase()

    if (typeLower.includes('liveness') || typeLower.includes('selfie')) return 'Liveness Check'
    if (typeLower.includes('valid_id') || typeLower.includes('nin') || typeLower.includes('passport')) return 'Valid ID'
    if (typeLower.includes('address') || typeLower.includes('utility') || typeLower.includes('bill')) return 'Proof of Address'
    if (typeLower.includes('portfolio') || typeLower.includes('investment')) return 'Proof of Investment Activity'
    if (typeLower.includes('employment') || typeLower.includes('experience')) return 'Proof of Professional Experience'
    if (typeLower.includes('w-8ben') || typeLower.includes('tax')) return 'W-8BEN Form'

    // Fallback: Convert snake_case or camelCase to Title Case
    return documentType
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  /**
   * Helper to safely parse JSON strings
   */
  private safeJsonParse(value: any) {
    if (!value) return null
    if (typeof value === 'object') return value
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
}