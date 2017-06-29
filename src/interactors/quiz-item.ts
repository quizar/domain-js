
const debug = require('debug')('quizar-domain');
import { QuizItem, WikiEntity } from '../entities';
import { Bluebird, _ } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository, IQuizItemRepository } from './repository';
import { WikiEntityUseCases } from './wiki-entity';
import { DataValidationError, DataConflictError, catchError } from '../errors';

export class QuizItemUseCases extends UseCaseSet<QuizItem, IQuizItemRepository> {

    constructor(rep: IQuizItemRepository, private entityUseCases: WikiEntityUseCases) {
        super(rep);
    }

    create(data: QuizItem): Bluebird<QuizItem> {
        if (!data) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        let entities: WikiEntity[] = [];

        if (data.entity) {
            entities.push(data.entity);
        }

        if (data.value && data.value.entity) {
            entities.push(data.value.entity);
        }

        if (data.topics && data.topics.length) {
            const utopics = _.uniqBy(data.topics, 'id');
            if (utopics.length !== data.topics.length) {
                return Bluebird.reject(new DataValidationError({ message: '`topics` must contain unique items' }));
            }
            entities.concat(utopics);
        }

        entities = _.uniqBy(entities, 'id');

        return Bluebird.map(entities, entity => {
            return this.entityUseCases.create(entity).catch(DataConflictError, error => debug('trying to add an existing entity'));
        }).then(() => {
            return super.create(data).then(quizItem => {
                if (quizItem.topics && quizItem.topics.length) {
                    return Bluebird.each(quizItem.topics, topic => {
                        return this.setTopicCountQuizItems(topic.id);
                    }).then(() => quizItem);
                }

                return quizItem;
            });
        });
    }

    setTopicCountQuizItems(topicId: string): Bluebird<number> {
        return this.repository.countByTopicId(topicId)
            .then(count => this.entityUseCases.update({ id: topicId, countQuizItems: count }).then(() => count));
    }
}
