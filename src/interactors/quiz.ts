
import { Quiz } from '../entities'
import { Promise } from '../utils'
import { UseCaseSet } from './use-case-set'
import { IRepository } from './repository';

export interface IQuizRepository extends IRepository<Quiz> {

}

export class QuizUseCases extends UseCaseSet<Quiz, IQuizRepository> {

}
