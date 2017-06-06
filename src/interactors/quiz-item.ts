
import { QuizItem } from '../entities/quiz-item'
import { Promise, IBaseRepository } from '../utils'
import { UseCaseSet } from './use-case-set'

export interface IQuizItemRepository extends IBaseRepository<QuizItem> {

}

export class QuizItemUseCases extends UseCaseSet<QuizItem, IQuizItemRepository>{

}
