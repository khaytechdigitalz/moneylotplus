import vine from '@vinejs/vine'

/**
 * Step 1: Basic Identity & Personal Info Validator
 */
export const complianceStepOneValidator = vine.compile(
  vine.object({
    phone: vine.string().trim().mobile({ locale: ['en-NG', 'en-GB', 'en-US'] }),
    nationality: vine.string().trim().minLength(2).maxLength(50),
    countryOfBirth: vine.string().trim().minLength(2).maxLength(50),

    dateOfBirth: vine.date({ formats: ['YYYY-MM-DD'] }).before(() => {
      const eighteenYearsAgo = new Date()
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
      return eighteenYearsAgo.toISOString().split('T')[0]
    }),
  })
)

/**
 * Step 2: Individual Compliance Assessment Validator
*/
export const complianceStepTwoIndividualValidator = vine.compile(
  vine.object({
    // Column 1: Array of chosen services
    selectedServices: vine.array(vine.string().trim()).minLength(1),

    // Column 2: Employment & Income Details
    employmentDetails: vine.object({
      status: vine.string().trim(),
      employer: vine.string().trim().optional(),
      annualIncome: vine.string().trim(),
      investmentPortfolio: vine.string().trim(),
    }),

    // Column 3: Investment Background
    investmentBackground: vine.object({
      yearsActiveInvesting: vine.string().trim(),
      typicalTransactionSize: vine.string().trim(),
    }),

    // Column 4: Knowledge Assessment Answers (Optional) (Dynamic Key-Value Map)
    knowledgeAnswers: vine
      .record(vine.string().trim())
      .optional(),

    // Column 5: Evidence File Uploads (Optional)
    evidenceOfSale: vine
      .object({
        tradingFrequencyProof: vine
          .file({ size: '25mb', extnames: ['pdf', 'csv', 'jpg', 'png'] })
          .optional(),
        portfolioSizeProof: vine
          .file({ size: '25mb', extnames: ['pdf', 'csv', 'jpg', 'png'] })
          .optional(),
        professionalExperience: vine
          .file({ size: '25mb', extnames: ['pdf', 'csv', 'jpg', 'png'] })
          .optional(),
      })
      .optional(),
  })
)

export const complianceStepFourValidator = vine.compile(
  vine.object({
    // Screen 1: Services
    servicesAndSettlements: vine.array(vine.string()).minLength(1),

    // Screen 2: Mandate Profile
    mandateProfile: vine.object({
      investmentObjective: vine.string().trim(),
      investmentHorizon: vine.string().trim(),
    }),

    // Screen 3: Settlement Account Details
    settlementAccount: vine.object({
      accountName: vine.string().trim(),
      bankName: vine.string().trim(),
      bankBranch: vine.string().trim().optional(),
      sortCodeSwiftBic: vine.string().trim(),
      accountNumberIban: vine.string().trim(),
      accountCurrency: vine.string().trim().maxLength(10),
    }),
  })
)

/**
 * Step 1: Basic Identity & Business Info Validator
 */
export const complianceBusinessStepOneValidator = vine.compile(
  vine.object({
    business_category: vine.string().trim().minLength(2).maxLength(50),
    business_nature: vine.string().trim().minLength(2).maxLength(50),
  })
)

export const complianceStepTwoBusinessValidator = vine.compile(
  vine.object({
    selectedServices: vine.array(vine.string()).minLength(1),
    beneficial_owners: vine.array(
      vine.object({
        name: vine.string().trim().minLength(2),
        date_of_birth: vine.string().trim(),
        basis_of_control: vine.string().trim(),
      })
    ).minLength(1),
    structure: vine.enum(['Single-Family', 'Multi-Family']),
    assets_under_management: vine.string().trim(),
    investing_as: vine.enum(['Principal', 'Agent']),
    
    // File upload inputs (optional files max 10MB each)
    ceritifcate_of_incomporation: vine.file({ size: '10mb', extnames: ['pdf', 'png', 'jpg', 'jpeg'] }).optional(),
    certified_ownership_structure: vine.file({ size: '10mb', extnames: ['pdf', 'png', 'jpg', 'jpeg'] }).optional(),
    board_resolution: vine.file({ size: '10mb', extnames: ['pdf', 'png', 'jpg', 'jpeg'] }).optional(),
    proof_of_address: vine.file({ size: '10mb', extnames: ['pdf', 'png', 'jpg', 'jpeg'] }).optional(),
    financial_statement: vine.file({ size: '10mb', extnames: ['pdf', 'png', 'jpg', 'jpeg'] }).optional(),
  })
)