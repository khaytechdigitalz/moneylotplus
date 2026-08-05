import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserIbkrAccount extends BaseModel {
  public static table = 'user_ibkr_accounts'
  public static tableName = 'user_ibkr_accounts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare accountNumber: string | null

  @column()
  declare connectionType: 'oauth' | 'managed_subaccount'

  @column()
  declare accessToken: string | null

  @column()
  declare refreshToken: string | null

  @column.dateTime()
  declare tokenExpiresAt: DateTime | null

  @column()
  declare flexToken: string | null

  @column()
  declare flexQueryId: string | null

  @column()
  declare status: 'pending' | 'connected' | 'disconnected' | 'expired'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}