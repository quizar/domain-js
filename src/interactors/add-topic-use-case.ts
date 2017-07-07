
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { UpdateUseCase } from './update-use-case';
import { Repository, WikiEntityRepository, RepUpdateData, RepUpdateOptions } from './repository';
import { TopicIdIndexKey } from './data-keys';
import { QuizItem, Quiz, WikiEntity } from '../entities';
import { DataNotFoundError, DataValidationError } from '../errors';

export type AddTopicData = {
    refId: string
    topic: WikiEntity
}

export class AddTopicUseCase<T extends (QuizItem | Quiz)> extends BaseUseCase<AddTopicData, WikiEntity[], undefined>{
    constructor(name: string, private updateUseCase: UpdateUseCase<T>, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(data: AddTopicData): Bluebird<WikiEntity[]> {
        return this.repository.getById(data.refId).then(ref => {
            if (!ref) {
                return Bluebird.reject(new DataNotFoundError({ message: `Not found object by id ${data.refId}` }));
            }
            ref.topics = ref.topics || [];
            ref.topics.push(data.topic);

            return this.updateUseCase.execute({ item: ref }).then(item => item.topics);
        });
    }

    validateData(data: AddTopicData) {
        if (typeof data.refId !== 'string') {
            return Bluebird.reject(new DataValidationError({ message: `refId is invalid` }));
        }

        return super.validateData(data);
    }
}
