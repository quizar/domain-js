
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { TopicCountRepository, RepAccessOptions, RepGetData } from './repository';

export class CountByTopicIdUseCase<T> extends BaseUseCase<string, number, undefined>{
    constructor(name: string, private repository: TopicCountRepository<T>) {
        super(name);
    }

    protected innerExecute(topicId: string): Bluebird<number> {
        return this.repository.countByTopicId(topicId);
    }
}
