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
 * Matches the newly restructured table columns & request payload
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

/**
 * Step 2: Corporate/Business Compliance Validator
 */
export const complianceStepTwoBusinessValidator = vine.compile(
  vine.object({
    companyName: vine.string().trim(),
    registrationNumber: vine.string().trim(),
    annualTurnover: vine.string().trim(),
    certificateOfIncorporation: vine.file({ size: '25mb', extnames: ['pdf'] }),
  })
)