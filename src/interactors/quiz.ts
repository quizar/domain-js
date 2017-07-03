
const debug = require('debug')('quizar-domain');
import { Quiz, QuizItemInfo } from '../entities';
import { Bluebird, _ } from '../utils';
import { TopicUseCaseSet } from './topic-use-case-set';
import { WikiEntityUseCases } from './wiki-entity';
import { IRepository, IQuizRepository, RepAccessOptions, IQuizItemRepository, RepUpdateOptions } from './repository';
import { DataValidationError, DataConflictError, catchError, DataNotFoundError } from '../errors';
import { QuizValidator } from '../entities/validator';

export class QuizUseCases extends TopicUseCaseSet<Quiz, IQuizRepository> {

    constructor(rep: IQuizRepository, entityUseCases: WikiEntityUseCases, private quizItemRep: IQuizItemRepository) {
        super(rep, QuizValidator.instance, entityUseCases, 'countQuizzes');
    }

    create(data: Quiz, options?: RepAccessOptions): Bluebird<Quiz> {
        if (!data) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        const tasks = [];

        if (data.topics && data.topics.length) {
            data.topics.forEach(topic => tasks.push(this.entityUseCases.create(topic).catch(DataConflictError, error => { })));
        }

        return Bluebird.all(tasks).then(() => {
            return this.notExistsQuizItems(data.items && data.items.map(item => item.item.id) || [])
                .then(notExists => {
                    if (notExists.length) {
                        return Bluebird.reject(new DataNotFoundError({ message: `Not found QuizItem id in ${notExists}` }));
                    }
                    return super.create(data, options).then(quiz => {
                        if (quiz.topics && quiz.topics.length) {
                            return Bluebird.each(quiz.topics, topic => {
                                return this.setTopicCount(topic.id);
                            }).then(() => quiz);
                        }

                        return quiz;
                    });
                });
        });
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

    update(data: Quiz, options?: RepUpdateOptions) {
        return this.notExistsQuizItems(data.items && data.items.map(item => item.item.id) || [])
            .then(notExists => {
                if (notExists.length) {
                    return Bluebird.reject(new DataNotFoundError({ message: `Not found QuizItem id in ${notExists}` }));
                }
                return super.update(data, options);
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
