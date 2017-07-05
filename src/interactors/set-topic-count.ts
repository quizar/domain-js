
import { Bluebird } from '../utils';
import { BaseUseCase, UseCase } from './use-case';
import { TopicCountRepository, WikiEntityRepository, RepUpdateData, RepUpdateOptions } from './repository';
import { QuizItem, Quiz } from '../entities';

export class SetTopicCount<T extends (QuizItem | Quiz)> extends BaseUseCase<string, number, null>{
    constructor(private updateEntity: UseCase<RepUpdateData<T>, T, RepUpdateOptions>, private topicCountRepository: TopicCountRepository<T>, private countName: 'countQuizzes' | 'countQuizItems') {
        super('SetTopicCount');
    }

    protected innerExecute(topicId: string): Bluebird<number> {
        return this.topicCountRepository.countByTopicId(topicId)
            .then(count => {
                const obj = <T>{ id: topicId };
                obj[this.countName] = count;
                return this.updateEntity.execute({ item: obj }).return(count);
            });
    }
}
