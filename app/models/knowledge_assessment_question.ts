import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import KnowledgeAssessmentOption from '#models/knowledge_assessment_option'

export default class KnowledgeAssessmentQuestion extends BaseModel {
  public static table = 'knowledge_assessment_questions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare questionNumber: number

  @column()
  declare questionText: string

  @column()
  declare correctOption: string // 'A', 'B', or 'C'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationship: Question has many Options
  @hasMany(() => KnowledgeAssessmentOption, {
    foreignKey: 'questionId',
  })
  declare options: HasMany<typeof KnowledgeAssessmentOption>
}