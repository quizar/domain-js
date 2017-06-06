
import { Quiz } from '../entities/quiz'
import { Promise, IBaseRepository } from '../utils'
import { UseCaseSet } from './use-case-set'

export interface IQuizRepository extends IBaseRepository<Quiz> {

}

export class QuizUseCases extends UseCaseSet<Quiz, IQuizRepository> {

}
