import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import KnowledgeAssessmentQuestion from '#models/knowledge_assessment_question'

export default class KnowledgeAssessmentOption extends BaseModel {
  public static table = 'knowledge_assessment_options'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare questionId: number

  @column()
  declare optionKey: string // 'A', 'B', or 'C'

  @column()
  declare optionText: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationship: Option belongs to a Question
  @belongsTo(() => KnowledgeAssessmentQuestion, {
    foreignKey: 'questionId',
  })
  declare question: BelongsTo<typeof KnowledgeAssessmentQuestion>
}