
import { Bluebird, _ } from '../utils';
import { BaseUseCase } from './use-case';
import { UpdateUseCase } from './update-use-case';
import { Repository, WikiEntityRepository, RepUpdateData, RepUpdateOptions } from './repository';
import { TopicIdIndexKey } from './data-keys';
import { QuizItem, Quiz, WikiEntity } from '../entities';
import { DataNotFoundError, DataValidationError } from '../errors';

export type RemoveTopicData = {
    refId: string
    topicId: string
}

export class RemoveTopicUseCase<T extends (QuizItem | Quiz)> extends BaseUseCase<RemoveTopicData, WikiEntity[], undefined>{
    constructor(name: string, private updateUseCase: UpdateUseCase<T>, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(data: RemoveTopicData): Bluebird<WikiEntity[]> {
        return this.repository.getById(data.refId).then(ref => {
            if (!ref) {
                return Bluebird.reject(new DataNotFoundError({ message: `Not found object by id ${data.refId}` }));
            }
            ref.topics = ref.topics || [];

            const topicIndex = _.findIndex(ref.topics, { id: data.topicId });
            if (topicIndex < 0) {
                return Bluebird.reject(new DataValidationError({ message: `topic id ${data.topicId} not exists in ref object topics` }));
            }
            ref.topics.splice(topicIndex, 1);

            return this.updateUseCase.execute({ item: ref }).then(item => item.topics);
        });
    }

    validateData(data: RemoveTopicData) {
        if (typeof data.refId !== 'string') {
            return Bluebird.reject(new DataValidationError({ message: `refId is invalid` }));
        }

        if (typeof data.topicId !== 'string') {
            return Bluebird.reject(new DataValidationError({ message: `topicId is invalid` }));
        }

        return super.validateData(data);
    }
}
