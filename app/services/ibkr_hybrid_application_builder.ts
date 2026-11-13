import { createHash } from 'node:crypto'
import type { IbkrHybridAccountInput } from '#validators/ibkr_hybrid_account_validator'

export interface IbkrHybridApplication {
  application: Record<string, unknown>
}

function stableReferenceHash(reference: string): string {
  return createHash('sha256').update(reference).digest('hex').slice(0, 24)
}

function externalId(prefix: string, hash: string): string {
  return `${prefix}_${hash}`
}

function usernamePrefix(hash: string): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const bytes = Buffer.from(hash, 'hex')
  return Array.from({ length: 6 }, (_, index) => alphabet[bytes[index] % alphabet.length]).join('')
}

function ageOnToday(dateOfBirth: string): number {
  const dob = new Date(`${dateOfBirth}T00:00:00.000Z`)
  if (Number.isNaN(dob.getTime()) || dob.toISOString().slice(0, 10) !== dateOfBirth) {
    throw new Error('Date of birth is not a valid calendar date.')
  }

  const now = new Date()
  let age = now.getUTCFullYear() - dob.getUTCFullYear()
  const monthDifference = now.getUTCMonth() - dob.getUTCMonth()
  if (monthDifference < 0 || (monthDifference === 0 && now.getUTCDate() < dob.getUTCDate())) {
    age--
  }
  return age
}

function assertValidDates(input: IbkrHybridAccountInput): void {
  if (ageOnToday(input.date_of_birth) < 18) {
    throw new Error('IBKR applicant must be at least 18 years old.')
  }

  const expiry = new Date(`${input.passport_expiry}T00:00:00.000Z`)
  if (
    Number.isNaN(expiry.getTime()) ||
    expiry.toISOString().slice(0, 10) !== input.passport_expiry ||
    expiry <= new Date()
  ) {
    throw new Error('Passport expiry must be a valid future date in YYYY-MM-DD format.')
  }

  if (input.liquid_net_worth > input.net_worth) {
    throw new Error('Liquid net worth cannot exceed total net worth.')
  }

  for (const value of [input.dependents ?? 0, input.years_trading, input.trades_per_year]) {
    if (!Number.isInteger(value)) {
      throw new Error('Dependents, years trading and trades per year must be whole numbers.')
    }
  }

  const totalSourcePercentage = input.source_of_wealth.reduce(
    (sum, source) => sum + source.percentage,
    0
  )
  if (Math.abs(totalSourcePercentage - 100) > 0.001) {
    throw new Error('Source-of-wealth percentages must total 100%.')
  }

  if (['EMPLOYED', 'SELFEMPLOYED'].includes(input.employment_type)) {
    const required = [input.employer, input.occupation, input.employer_business]
    if (required.some((value) => !value?.trim())) {
      throw new Error(
        'Employer, occupation and employer business are required for employed or self-employed applicants.'
      )
    }
  }
}

/**
 * Builds the same Hybrid Individual application shape as the tested PHP tool.
 * This version uses real, validated onboarding values rather than QA defaults.
 * It is intentionally configured for UK-resident individual accounts (GBR/GBP).
 */
export function buildIbkrHybridIndividualApplication(
  input: IbkrHybridAccountInput,
  authenticatedUserId: string
): IbkrHybridApplication {
  assertValidDates(input)

  // Keep external IDs and username prefix stable for retries of this same
  // onboarding application. A new onboarding_reference creates a new set.
  const reference = input.application_reference?.trim() || authenticatedUserId
  if (!reference) throw new Error('A stable customer/onboarding reference is required.')
  const referenceHash = stableReferenceHash(reference)
  const customerExternalId = externalId('customer', referenceHash)
  const individualExternalId = externalId('individual', referenceHash)
  const accountExternalId = externalId('account', referenceHash)
  const userExternalId = externalId('user', referenceHash)
  const prefix = usernamePrefix(referenceHash)

  const accountHolderDetails: Record<string, unknown> = {
    externalId: individualExternalId,
    name: {
      first: input.first_name.trim(),
      last: input.last_name.trim(),
    },
    dateOfBirth: input.date_of_birth,
    countryOfBirth: input.country_of_birth.toUpperCase(),
    maritalStatus: input.marital_status ?? 'S',
    numDependents: input.dependents ?? 0,
    residenceAddress: {
      street1: input.street1,
      ...(input.street2 ? { street2: input.street2 } : {}),
      city: input.city,
      state: input.state.toUpperCase(),
      country: 'GBR',
      postalCode: input.postal_code,
    },
    phones: [
      {
        type: 'Mobile',
        number: input.phone.replace(/\D+/g, ''),
        country: 'GBR',
        verified: false,
      },
    ],
    email: input.email,
    titles: [{ value: 'Account Holder' }],
    identification: {
      citizenship: input.citizenship.toUpperCase(),
      passport: input.passport_number,
      issuingCountry: 'GBR',
      expire: true,
      expirationDate: input.passport_expiry,
    },
    employmentType: input.employment_type,
    taxResidencies: [
      {
        country: 'GBR',
        tin: input.tax_identifier,
      },
    ],
  }

  if (['EMPLOYED', 'SELFEMPLOYED'].includes(input.employment_type)) {
    accountHolderDetails.employmentDetails = {
      employer: input.employer,
      occupation: input.occupation,
      employerBusiness: input.employer_business,
      employerAddress: {
        street1: input.employer_street1 || input.street1,
        city: input.employer_city || input.city,
        state: input.state.toUpperCase(),
        country: 'GBR',
        postalCode: input.employer_postal_code || input.postal_code,
      },
    }
  }

  const customer = {
    accountHolder: {
      accountHolderDetails: [accountHolderDetails],
      financialInformation: [
        {
          investmentExperience: [
            {
              assetClass: 'STK',
              yearsTrading: input.years_trading,
              tradesPerYear: input.trades_per_year,
              knowledgeLevel: input.knowledge_level,
            },
          ],
          sourcesOfWealth: input.source_of_wealth.map((source) => ({
            sourceType: source.source_type,
            percentage: source.percentage,
            usedForFunds: source.used_for_funds,
          })),
          netWorth: input.net_worth,
          liquidNetWorth: input.liquid_net_worth,
          annualNetIncome: input.annual_income,
          translated: false,
        },
      ],
      regulatoryInformation: [
        {
          regulatoryDetail: [
            { code: 'ControlPubTraded', status: input.control_pub_traded },
            { code: 'EmployeePubTrade', status: input.employee_pub_trade },
            { code: 'AFFILIATION', status: input.affiliation },
          ],
          translated: false,
        },
      ],
    },
    externalId: customerExternalId,
    type: 'INDIVIDUAL',
    prefix,
    email: input.email,
    mdStatusNonPro: input.md_status_non_pro,
  }

  const account = {
    externalId: accountExternalId,
    alias: input.account_alias?.trim() || 'IBKR Individual Account',
    baseCurrency: 'GBP',
    multiCurrency: false,
    margin: input.margin,
    investmentObjectives: input.investment_objectives,
    tradingPermissions: [
      {
        country: 'UNITED KINGDOM',
        product: 'STOCKS',
      },
    ],
    advisorWrapFees: {
      strategy: 'NO_FEE',
      chargeAdvisor: false,
      chargeOtherFeesToAdvisor: false,
    },
  }

  const user = {
    externalUserId: userExternalId,
    externalIndividualId: individualExternalId,
    prefix,
  }

  return {
    application: {
      customer,
      accounts: [account],
      users: [user],
      translation: false,
    },
  }
}
