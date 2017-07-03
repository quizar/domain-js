
import { Quiz, QuizItemInfo } from '../entities';
import { Bluebird, _ } from '../utils';
import { TopicUseCaseSet } from './topic-use-case-set';
import { WikiEntityUseCases } from './wiki-entity';
import { IRepository, IQuizRepository, RepAccessOptions } from './repository';
import { DataValidationError, DataConflictError, catchError, DataNotFoundError } from '../errors';
import { QuizValidator } from '../entities/validator';

export class QuizUseCases extends TopicUseCaseSet<Quiz, IQuizRepository> {

    constructor(rep: IQuizRepository, entityUseCases: WikiEntityUseCases) {
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
            return super.create(data, options).then(quiz => {
                if (quiz.topics && quiz.topics.length) {
                    return Bluebird.each(quiz.topics, topic => {
                        return this.setTopicCount(topic.id);
                    }).then(() => quiz);
                }

                return quiz;
            });
        });
    }

    addQuizItemInfo(quizId: string, data: QuizItemInfo) {
        return this.repository.getById(quizId).then(quiz => {
            if (!quiz) {
                return Bluebird.reject(new DataNotFoundError({ message: `Not found quiz id=${quizId}` }));
            }
            quiz.items = quiz.items || [];
            
            const qii = _.findIndex(quiz.items, item => item.item.id === data.item.id);
            if (qii > -1) {
                return Bluebird.reject(new DataConflictError({ message: `Quiz id=${quizId} has an item with id=${data.item.id}` }));
            }

            quiz.items.push(data);

            return this.update({ id: quizId, items: quiz.items });
        });
    }

    removeQuizItemInfo(quizId: string, quizItemId: string) {
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

            return this.update({ id: quizId, items: quiz.items });
        });
    }

}
