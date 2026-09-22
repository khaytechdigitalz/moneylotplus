import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserIndividualProfile extends BaseModel {
  // 1. Explicitly point to your prefixed table name
  public static table = 'users_individual_profiles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare phone: string // Kept as string to preserve country codes and leading zeros

  @column()
  declare nationality: string

  declare dateOfBirth: DateTime | string

  @column()
  declare countryOfBirth: string

  @column()
  declare maritalStatus: string | null

  @column()
  declare dependants: string | null

  // General / Primary Address Details
  @column()
  declare addressLine1: string | null

  @column()
  declare addressLine2: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare city: string | null

  @column()
  declare country: string | null

  @column()
  declare countryOfResidence: string

  // Mailing Address Details
  @column()
  declare mailingAddressLine1: string | null

  @column()
  declare mailingAddressLine2: string | null

  // Residential Address Details
  @column()
  declare residentialAddressLine1: string | null

  @column()
  declare residentialAddressLine2: string | null

  @column()
  declare residentialPostalCode: string | null

  @column()
  declare residentialCity: string | null

  @column()
  declare residentialCountry: string | null

  @column()
  declare complianceStep: string

  @column()
  declare complianceStatus: string | null

  @column()
  declare complianceNote: string | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // 2. Define relationship: This profile belongs to a User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}