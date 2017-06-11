
import { Topic } from '../entities';
import { Promise } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository } from './repository';

export interface ITopicRepository extends IRepository<Topic> {

}

export class TopicUseCases extends UseCaseSet<Topic, ITopicRepository> {

}
