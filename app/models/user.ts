// app/models/user.ts
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne,belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasOne,BelongsTo } from '@adonisjs/lucid/types/relations'
import UserIndividualProfile from '#models/user_individual_profile'
import UsersSettlementAccount from '#models/users_settlement_account'
import UserComplianceDocument from '#models/users_compliance_documents'
import UserBusinessProfile from '#models/user_business_profile'
import UserAdminProfile from '#models/user_admin_profile'
import UsersComplianceAssessment from '#models/users_compliance_assessment' 
import Team from '#models/team'

// 1. Configure AuthFinder with a hashing strategy and matching fields
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

// 2. We use 'compose' to combine BaseModel with the AuthFinder features
export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users'

  @column()
  declare teamId: number | null

  @column()
  declare roleId: number | null

  @belongsTo(() => Team)
  declare team: BelongsTo<typeof Team>


  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ columnName: 'otp_token', serializeAs: null })
  declare otpToken: string | null

  @column.dateTime({ columnName: 'otp_token_sent_at' })
  declare otpTokenSentAt: DateTime | null

  @column()
  declare accountType: 'individual' | 'business' | 'admin'

  @column()
  declare role: 'admin' | 'customer' | 'team'

  @column()
  declare status: 'active' | 'blocked' | 'pending'

  @column({ columnName: 'otp_token_attempts' })
  declare otpTokenAttempts: number

  // Change this from @column() to @column.dateTime()
  @column.dateTime({ columnName: 'otp_token_expires_at' })
  declare otpTokenExpiresAt: DateTime | null

// Change this from @column() to @column.dateTime()
  @column.dateTime({ columnName: 'blocked_until' })
  declare blockedUntil: DateTime | null

  @column()
  declare isEmailVerified: boolean

  @column()
  declare mfaSecret: string | null

  @column()
  declare isMfaEnabled: boolean

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @column()
  declare isTwoFactorEnabled: boolean

  @column({ serializeAs: null })
  declare twoFactorSecret: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => UsersSettlementAccount)
  declare settlementAccount: HasOne<typeof UsersSettlementAccount>

  @hasOne(() => UserComplianceDocument)
  declare complianceDocuments: HasOne<typeof UserComplianceDocument>
  
  @hasOne(() => UserIndividualProfile)
  declare individualProfile: HasOne<typeof UserIndividualProfile>

  @hasOne(() => UserBusinessProfile)
  declare businessProfile: HasOne<typeof UserBusinessProfile>

  @hasOne(() => UserAdminProfile)
  declare adminProfile: HasOne<typeof UserAdminProfile>

  @hasOne(() => UsersComplianceAssessment)
  declare complianceAssessment: HasOne<typeof UsersComplianceAssessment>
  
  // NOTE: Manual @beforeSave hashPassword removed. 
  // The AuthFinder mixin manages this automatically!

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 day',
    table: 'api_tokens',
  })
  
}