
import KnowledgeAssessmentQuestion from '#models/knowledge_assessment_question'
export class knowledgeAssessmentService {
  
  /**
   * Processes incoming Sumsub webhook payload for Individual and Business accounts
   */
  static async KnowledgeAssessment() {

   const questions = await KnowledgeAssessmentQuestion.query()
  .orderBy('questionNumber', 'asc')
  .preload('options', (optionsQuery) => {
    optionsQuery.orderBy('optionKey', 'asc')
  })
  return questions;
  }
}