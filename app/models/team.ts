import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Team extends BaseModel {
  public static table = 'teams'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare status: string
  
  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User, {
    foreignKey: 'teamId',
  })
  declare members: HasMany<typeof User>
}