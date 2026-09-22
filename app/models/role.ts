import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Team from '#models/team'
import Permission from '#models/permission'

export default class Role extends BaseModel {
  public static table = 'roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare teamId: number

  @column()
  declare name: string

  @column()
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Team)
  declare team: BelongsTo<typeof Team>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  declare permissions: ManyToMany<typeof Permission>
}