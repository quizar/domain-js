
import { Quiz } from '../entities';
import { Promise } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository, IQuizRepository } from './repository';

export class QuizUseCases extends UseCaseSet<Quiz, IQuizRepository> {

}
