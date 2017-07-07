
const debug = require('debug')('quizar-domain');
import { Bluebird, md5, _ } from '../../utils';
import { QuizItem, WikiEntity } from '../../entities';
import { QuizItemFields } from '../../entities/entity-fields';
import { Repository, RepAccessOptions, RepUpdateData, RepUpdateOptions, TopicCountRepository } from '../repository';
import { UpdateUseCase } from '../update-use-case';
import { QuizItemValidator } from '../../entities/validator';
import { DataValidationError, DataConflictError, DataNotFoundError } from '../../errors';
import { EntityCreate, EntityUpdate } from '../entity';
import { prepareTopics, formatPropertyEntities } from '../helpers';
import { SetTopicCountUseCase } from '../set-topic-count-use-case';

export class QuizItemUpdate extends UpdateUseCase<QuizItem>{
    private setTopicCount: SetTopicCountUseCase<QuizItem>;

    constructor(repository: TopicCountRepository<QuizItem>, private createEntity: EntityCreate, updateEntity: EntityUpdate) {
        super('QuizItemUpdate', repository, QuizItemValidator.instance);

        this.setTopicCount = new SetTopicCountUseCase<QuizItem>(updateEntity, repository, 'countQuizItems');
    }

    protected innerExecute(data: RepUpdateData<QuizItem>, options?: RepUpdateOptions): Bluebird<QuizItem> {
        const itemData = data.item;

        return Bluebird.resolve(Array.isArray(itemData.topics))
            .then(setTopics => {
                if (setTopics) {
                    return this.repository.getById(itemData.id, { fields: [QuizItemFields.id, QuizItemFields.topics] })
                        .then(quizItem => {
                            if (!quizItem) {
                                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz item id=${itemData.id}` }));
                            }
                            return _.differenceBy(quizItem.topics || [], itemData.topics, 'id');
                        })
                        .then(deletedTopics => itemData.topics.concat(deletedTopics));
                }
            })
            .then(updatedTopics => Bluebird.resolve(formatPropertyEntities(itemData))
                .then(entities => itemData.entity && entities.concat([itemData.entity]) || entities)
                .then(entities => prepareTopics(itemData.topics).then(topics => entities.concat(topics)))
                .then(entities => _.uniqBy(entities, 'id'))
                .map(entity => this.createEntity.execute(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
                .then(() => super.innerExecute(data, options).then(quizItem => {
                    if (updatedTopics && updatedTopics.length) {
                        return Bluebird.map(updatedTopics, topic => {
                            return this.setTopicCount.execute(topic.id);
                        }).then(() => quizItem);
                    }

                    return quizItem;
                })));
    }
}
