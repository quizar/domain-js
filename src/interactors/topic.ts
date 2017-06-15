
import { Topic } from '../entities';
import { Promise } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository, ITopicRepository } from './repository';

export class TopicUseCases extends UseCaseSet<Topic, ITopicRepository> {

}
