
const debug = require('debug')('quizar-domain');
import { Quiz, QuizItemInfo, QuizFields } from '../entities';
import { Bluebird, _, md5, slug } from '../utils';
import { TopicUseCaseSet } from './topic-use-case-set';
import { WikiEntityUseCases } from './wiki-entity';
import { Repository, QuizRepository, RepAccessOptions, QuizItemRepository, RepUpdateOptions } from './repository';
import { DataValidationError, DataConflictError, catchError, DataNotFoundError } from '../errors';
import { QuizValidator } from '../entities/validator';

export class QuizUseCases extends TopicUseCaseSet<Quiz, QuizRepository> {

    constructor(rep: QuizRepository, entityUseCases: WikiEntityUseCases, private quizItemRep: QuizItemRepository) {
        super(rep, QuizValidator.instance, entityUseCases, 'countQuizzes');
    }

    createId(data: Quiz): string {
        try {
            return slug(data.id || data.title.trim()).substr(0, 32).replace(/[^\w\d]+$/, '');
        } catch (e) {
            throw new DataValidationError({ error: e, message: 'title is required' });
        }
    }

    create(data: Quiz, options?: RepAccessOptions): Bluebird<Quiz> {
        if (!data) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }

        try {
            data.id = this.createId(data);
        } catch (e) {
            return Bluebird.reject(e);
        }

        return this.prepareTopics(data.topics)
            .map(entity => this.entityUseCases.create(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
            .return(this.notExistsQuizItems(data.items && data.items.map(item => item.item.id) || [])
                .then(notExists => {
                    if (notExists.length) {
                        return Bluebird.reject(new DataNotFoundError({ message: `Not found QuizItem id in ${notExists}` }));
                    }
                    return super.create(data, options).then(quiz => {
                        if (quiz.topics && quiz.topics.length) {
                            return Bluebird.map(quiz.topics, topic => this.setTopicCount(topic.id)).return(quiz);
                        }

                        return quiz;
                    });
                }));
    }

    update(data: Quiz, options?: RepUpdateOptions) {
        return Bluebird.resolve(Array.isArray(data.topics))
            .then(setTopics => {
                if (setTopics) {
                    return this.getById(data.id, { fields: [QuizFields.id, QuizFields.topics] })
                        .then(quiz => {
                            if (!quiz) {
                                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz id=${data.id}` }));
                            }
                            return _.differenceBy(quiz.topics || [], data.topics, 'id');
                        })
                        .then(deletedTopics => data.topics.concat(deletedTopics));
                }
            })
            .then(updatedTopics => this.prepareTopics(data.topics)
                .map(entity => this.entityUseCases.create(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
                .return(this.notExistsQuizItems(data.items && data.items.map(item => item.item.id) || [])
                    .then(notExists => {
                        if (notExists.length) {
                            return Bluebird.reject(new DataNotFoundError({ message: `Not found QuizItem id in ${notExists}` }));
                        }
                        return super.update(data, options)
                            .then(quiz => {
                                if (updatedTopics && updatedTopics.length) {
                                    return Bluebird.map(updatedTopics, topic => this.setTopicCount(topic.id)).return(quiz);
                                }

                                return quiz;
                            });
                    }))
            );
    }

    addQuizItemInfo(quizId: string, data: QuizItemInfo): Bluebird<QuizItemInfo> {
        debug('addQuizItemInfo start');
        return this.repository.getById(quizId).then(quiz => {
            debug('addQuizItemInfo got quiz', quiz);
            if (!quiz) {
                debug('addQuizItemInfo not found quiz');
                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz id=${quizId}` }));
            }
            debug('addQuizItemInfo got quiz');
            quiz.items = quiz.items || [];

            const qii = _.findIndex(quiz.items, item => item.item.id === data.item.id);
            if (qii > -1) {
                return Bluebird.reject(new DataConflictError({ message: `Quiz id=${quizId} has an item with id=${data.item.id}` }));
            }
            quiz.items.push(data);
            debug('addQuizItemInfo updating quiz items');
            return this.update({ id: quizId, items: quiz.items }).then(() => data);
        });
    }

    removeQuizItemInfo(quizId: string, quizItemId: string): Bluebird<boolean> {
        return this.repository.getById(quizId).then(quiz => {
            if (!quiz) {
                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz id=${quizId}` }));
            }
            quiz.items = quiz.items || [];

            const qii = _.findIndex(quiz.items, item => item.item.id === quizItemId);
            if (qii < 0) {
                return Bluebird.reject(new DataNotFoundError({ message: `Quiz id=${quizId} has not an item with id=${quizItemId}` }));
            }

            quiz.items.splice(qii, 1);

            return this.update({ id: quizId, items: quiz.items }).then(() => true);
        });
    }

    private notExistsQuizItems(items: string[]): Bluebird<string[]> {
        items = items || [];
        if (items.length === 0) {
            return Bluebird.resolve([]);
        }
        return Bluebird.map(items, item => this.quizItemRep.exists(item).then(exists => exists ? null : item)).then(result => result.filter(item => !!item));
    }
}
