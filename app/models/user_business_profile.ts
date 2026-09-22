// app/models/user_business_profile.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserBusinessProfile extends BaseModel {
  // 1. Explicitly point to your prefixed table name
  public static table = 'users_business_profiles'

  @column({ isPrimary: true })
  declare id: number


  @column()
 declare businessCategory: string
 
  @column()
 declare businessNature: string

  @column()
 declare businessRegulation: string

  @column()
  declare userId: number

  @column()
  declare representativeFullName: string

  @column()
  declare businessName: string


  @column()
  declare countryOfOperations: string

  @column()
  declare fcaNumber: string | null

  @column()
  declare companiesHouseNumber: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare complianceStep: string
  
  @column()
  declare complianceStatus: string | null

  @column()
  declare complianceNote: string | null

  // 2. Define relationship: This profile belongs to a User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}