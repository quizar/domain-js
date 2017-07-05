
const debug = require('debug')('quizar-domain');
import { Bluebird, md5, _ } from '../../utils';
import { QuizItem, WikiEntity } from '../../entities';
import { Repository, RepAccessOptions, TopicCountRepository } from '../repository';
import { CreateUseCase } from '../create-use-case';
import { QuizItemValidator } from '../../entities/validator';
import { DataValidationError, DataConflictError } from '../../errors';
import { CreateEntity, UpdateEntity } from '../entity';
import { prepareTopics, formatPropertyEntities } from '../helpers';
import { SetTopicCount } from '../set-topic-count';

export class CreateQuizItem extends CreateUseCase<QuizItem>{
    private setTopicCount: SetTopicCount<QuizItem>;

    constructor(repository: TopicCountRepository<QuizItem>, private createEntity: CreateEntity, updateEntity: UpdateEntity) {
        super('CreateQuizItem', repository, QuizItemValidator.instance);

        this.setTopicCount = new SetTopicCount<QuizItem>(updateEntity, repository, 'countQuizItems');
    }

    static createId(data: QuizItem): string {
        try {
            return md5([data.entity.id.trim().toUpperCase(), data.property.id.trim().toUpperCase()].join('|'));
        } catch (e) {
            throw new DataValidationError({ error: e, message: 'entity and property are required' });
        }
    }

    innerExecute(data: QuizItem, options?: RepAccessOptions): Bluebird<QuizItem> {
        if (!data || !data.property || !data.entity) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        try {
            data.id = CreateQuizItem.createId(data);
        } catch (e) {
            return Bluebird.reject(e);
        }

        return Bluebird.resolve(formatPropertyEntities(data))
            .then(entities => entities.concat([data.entity]))
            .then(entities => prepareTopics(data.topics).then(topics => entities.concat(topics)))
            .then(entities => _.uniqBy(entities, 'id'))
            .map(entity => this.createEntity.execute(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
            .then(() => super.innerExecute(data, options).then(quizItem => {
                if (quizItem.topics && quizItem.topics.length) {
                    return Bluebird.map(quizItem.topics, topic => {
                        return this.setTopicCount.execute(topic.id);
                    }).then(() => quizItem);
                }

                return quizItem;
            }));
    }
}
