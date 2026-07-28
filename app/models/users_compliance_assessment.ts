import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UsersComplianceAssessment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare profileType: 'individual' | 'business'

  // Column 1: Array of chosen services
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare selectedServices: string[] | null

  // Column 2: Status, employer, annual income, portfolio size range
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare employmentDetails: Record<string, any> | null

  // Column 3: Active investing duration & typical transaction sizes
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare investmentBackground: Record<string, any> | null

  @column()
  declare identityVerificationStatus: string | null

  @column()
  declare identityVerificationData: string | null

  @column()
  declare identityVerificationId: string | null
  
  // Column 4: Answers to compliance questions (Optional)
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare knowledgeAssessment: Record<string, any> | null

  // Column 5: Document path mappings for compliance proof (Optional)
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare evidenceOfSale: Record<string, string> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}