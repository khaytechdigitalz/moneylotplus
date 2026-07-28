// app/models/user_individual_profile.ts
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
  declare phone: string // Kept as string to preserve country codes and leading zeros

  @column()
  declare nationality: string
  
@column.date({
    serialize: (value) => value ? value.toISODate() : null
  })
  declare dateOfBirth: DateTime

  @column()
  declare countryOfBirth: string

  @column()
  declare complianceStep: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare countryOfResidence: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // 2. Define relationship: This profile belongs to a User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}