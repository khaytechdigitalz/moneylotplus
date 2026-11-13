import vine from '@vinejs/vine'

/**
 * Validates the applicant/account data collected by your onboarding flow.
 * This validator deliberately does not contain fake/default applicant data.
 * All compliance answers must come from the applicant's truthful answers.
 *
 * This first implementation is for the UK individual Hybrid flow used by
 * the successful PHP QA builder (GBR residence, GBP account, UK STOCKS).
 */
export const createIbkrHybridAccountValidator = vine.compile(
  vine.object({
    // Stable onboarding record reference; reuse it when retrying the same IBKR submission.
    application_reference: vine.string().trim().minLength(1).maxLength(100).optional(),
    first_name: vine.string().trim().minLength(1).maxLength(50),
    last_name: vine.string().trim().minLength(1).maxLength(50),
    email: vine.string().trim().email().maxLength(254),
    date_of_birth: vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    country_of_birth: vine.string().trim().regex(/^[A-Za-z]{3}$/),
    citizenship: vine.string().trim().regex(/^[A-Za-z]{3}$/),

    street1: vine.string().trim().minLength(3).maxLength(200),
    street2: vine.string().trim().maxLength(200).optional(),
    city: vine.string().trim().minLength(1).maxLength(100),
    // IBKR expects an ISO 3166-2 subdivision code, e.g. GB-LND.
    state: vine.string().trim().minLength(2).maxLength(32),
    postal_code: vine.string().trim().minLength(2).maxLength(20),
    phone: vine.string().trim().minLength(7).maxLength(24),

    passport_number: vine.string().trim().minLength(4).maxLength(32),
    passport_expiry: vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    tax_identifier: vine.string().trim().minLength(2).maxLength(64),

    marital_status: vine.enum(['S', 'M', 'D', 'W']).optional(),
    dependents: vine.number().min(0).max(30).optional(),

    employment_type: vine.enum([
      'UNEMPLOYED',
      'EMPLOYED',
      'SELFEMPLOYED',
      'RETIRED',
      'STUDENT',
      'ATHOMETRADER',
      'HOMEMAKER',
    ]),
    employer: vine.string().trim().maxLength(120).optional(),
    occupation: vine.string().trim().maxLength(120).optional(),
    employer_business: vine.string().trim().maxLength(160).optional(),
    employer_street1: vine.string().trim().maxLength(200).optional(),
    employer_city: vine.string().trim().maxLength(100).optional(),
    employer_postal_code: vine.string().trim().maxLength(20).optional(),

    net_worth: vine.number().min(101),
    liquid_net_worth: vine.number().min(101),
    annual_income: vine.number().min(0),
    years_trading: vine.number().min(0).max(60),
    trades_per_year: vine.number().min(0).max(100000),
    knowledge_level: vine.enum(['None', 'Limited', 'Good', 'Extensive']),

    // These are real applicant declarations; never silently default them to false.
    control_pub_traded: vine.boolean(),
    employee_pub_trade: vine.boolean(),
    affiliation: vine.boolean(),
    md_status_non_pro: vine.boolean(),

    // IBKR source-of-wealth enumeration values should be sourced from the
    // advisor's current IBKR enumerations. SOW-IND-Income is the prior QA value.
    source_of_wealth: vine.array(
      vine.object({
        source_type: vine.string().trim().minLength(1).maxLength(80),
        percentage: vine.number().min(1).max(100),
        used_for_funds: vine.boolean(),
      })
    ).minLength(1),

    margin: vine.enum(['Cash', 'Margin', 'RegT', 'PortfolioMargin']),
    investment_objectives: vine.array(
      vine.enum(['Preservation', 'Income', 'Growth', 'Trading', 'Speculation', 'Hedging'])
    ).minLength(1),
    account_alias: vine.string().trim().maxLength(80).optional(),
  })
)

export type IbkrHybridAccountInput = {
  application_reference?: string
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  country_of_birth: string
  citizenship: string
  street1: string
  street2?: string
  city: string
  state: string
  postal_code: string
  phone: string
  passport_number: string
  passport_expiry: string
  tax_identifier: string
  marital_status?: 'S' | 'M' | 'D' | 'W'
  dependents?: number
  employment_type: 'UNEMPLOYED' | 'EMPLOYED' | 'SELFEMPLOYED' | 'RETIRED' | 'STUDENT' | 'ATHOMETRADER' | 'HOMEMAKER'
  employer?: string
  occupation?: string
  employer_business?: string
  employer_street1?: string
  employer_city?: string
  employer_postal_code?: string
  net_worth: number
  liquid_net_worth: number
  annual_income: number
  years_trading: number
  trades_per_year: number
  knowledge_level: 'None' | 'Limited' | 'Good' | 'Extensive'
  control_pub_traded: boolean
  employee_pub_trade: boolean
  affiliation: boolean
  md_status_non_pro: boolean
  source_of_wealth: {
    source_type: string
    percentage: number
    used_for_funds: boolean
  }[]
  margin: 'Cash' | 'Margin' | 'RegT' | 'PortfolioMargin'
  investment_objectives: ('Preservation' | 'Income' | 'Growth' | 'Trading' | 'Speculation' | 'Hedging')[]
  account_alias?: string
}