
const debug = require('debug')('quizar-domain');
import { QuizItem, WikiEntity } from '../entities';
import { Bluebird, _ } from '../utils';
import { TopicUseCaseSet } from './topic-use-case-set';
import { IRepository, IQuizItemRepository, RepAccessOptions } from './repository';
import { WikiEntityUseCases } from './wiki-entity';
import { DataValidationError, DataConflictError, catchError } from '../errors';
import { QuizItemValidator } from '../entities/validator';

export class QuizItemUseCases extends TopicUseCaseSet<QuizItem, IQuizItemRepository> {

    constructor(rep: IQuizItemRepository, entityUseCases: WikiEntityUseCases) {
        super(rep, QuizItemValidator.instance, entityUseCases, 'countQuizItems');
    }

    create(data: QuizItem, options?: RepAccessOptions): Bluebird<QuizItem> {
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

        if (data.qualifier && data.qualifier.entity) {
            entities.push(data.qualifier.entity);
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
            return super.create(data, options).then(quizItem => {
                if (quizItem.topics && quizItem.topics.length) {
                    return Bluebird.each(quizItem.topics, topic => {
                        return this.setTopicCount(topic.id);
                    }).then(() => quizItem);
                }

                return quizItem;
            });
        });
    }
}
