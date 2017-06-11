
import { QuizItem } from '../entities';
import { Promise } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository } from './repository';

export interface IQuizItemRepository extends IRepository<QuizItem> {

}

export class QuizItemUseCases extends UseCaseSet<QuizItem, IQuizItemRepository>{

}
