
const debug = require('debug')('quizar-domain');
import { QuizItem, WikiEntity, QuizItemFields } from '../entities';
import { Bluebird, _, md5 } from '../utils';
import { TopicUseCaseSet } from './topic-use-case-set';
import { IRepository, IQuizItemRepository, RepAccessOptions, RepUpdateOptions } from './repository';
import { WikiEntityUseCases } from './wiki-entity';
import { DataValidationError, DataConflictError, catchError, DataNotFoundError } from '../errors';
import { QuizItemValidator } from '../entities/validator';

export class QuizItemUseCases extends TopicUseCaseSet<QuizItem, IQuizItemRepository> {

    constructor(rep: IQuizItemRepository, entityUseCases: WikiEntityUseCases) {
        super(rep, QuizItemValidator.instance, entityUseCases, 'countQuizItems');
    }

    createId(data: QuizItem): string {
        try {
            return md5([data.entity.id.trim().toUpperCase(), data.property.id.trim().toUpperCase()].join('|'));
        } catch (e) {
            throw new DataValidationError({ error: e, message: 'entity and property are required' });
        }
    }

    create(data: QuizItem, options?: RepAccessOptions): Bluebird<QuizItem> {
        if (!data || !data.property || !data.entity) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        try {
            data.id = this.createId(data);
        } catch (e) {
            return Bluebird.reject(e);
        }

        return Bluebird.resolve(this.formatPropertyEntities(data))
            .then(entities => entities.concat([data.entity]))
            .then(entities => this.prepareTopics(data.topics).then(topics => entities.concat(topics)))
            .then(entities => _.uniqBy(entities, 'id'))
            .map(entity => this.entityUseCases.create(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
            .then(() => super.create(data, options).then(quizItem => {
                if (quizItem.topics && quizItem.topics.length) {
                    return Bluebird.map(quizItem.topics, topic => {
                        return this.setTopicCount(topic.id);
                    }).then(() => quizItem);
                }

                return quizItem;
            }));
    }

    update(data: QuizItem, options?: RepUpdateOptions): Bluebird<QuizItem> {
        return Bluebird.resolve(Array.isArray(data.topics))
            .then(setTopics => {
                if (setTopics) {
                    return this.getById(data.id, { fields: [QuizItemFields.id, QuizItemFields.topics] })
                        .then(quizItem => {
                            if (!quizItem) {
                                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz item id=${data.id}` }));
                            }
                            return _.differenceBy(quizItem.topics || [], data.topics, 'id');
                        })
                        .then(deletedTopics => data.topics.concat(deletedTopics));
                }
            })
            .then(updatedTopics => Bluebird.resolve(this.formatPropertyEntities(data))
                .then(entities => data.entity && entities.concat([data.entity]) || entities)
                .then(entities => this.prepareTopics(data.topics).then(topics => entities.concat(topics)))
                .then(entities => _.uniqBy(entities, 'id'))
                .map(entity => this.entityUseCases.create(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
                .then(() => super.update(data, options).then(quizItem => {
                    if (updatedTopics && updatedTopics.length) {
                        return Bluebird.map(updatedTopics, topic => {
                            return this.setTopicCount(topic.id);
                        }).then(() => quizItem);
                    }

                    return quizItem;
                })));
    }

    private formatPropertyEntities(data: QuizItem): WikiEntity[] {
        const entities: WikiEntity[] = [];

        if (data.property && data.property.values) {
            data.property.values.forEach(value => {
                if (value.entity) {
                    entities.push(value.entity);
                }
                if (value.qualifiers && value.qualifiers.length) {
                    value.qualifiers.forEach(qualifier => {
                        if (qualifier.entity) {
                            entities.push(qualifier.entity);
                        }
                    });
                }
            });
        }

        return entities;
    }
}
