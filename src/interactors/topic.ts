
import { Topic } from '../entities/topic'
import { Promise, IBaseRepository } from '../utils'
import { UseCaseSet } from './use-case-set'

export interface ITopicRepository extends IBaseRepository<Topic> {

}

export class TopicUseCases extends UseCaseSet<Topic, ITopicRepository> {

}
