
import { Quiz } from '../entities';
import { Bluebird } from '../utils';
import { UseCaseSet } from './use-case-set';
import { WikiEntityUseCases } from './wiki-entity';
import { IRepository, IQuizRepository } from './repository';
import { DataValidationError, DataConflictError, catchError } from '../errors';

export class QuizUseCases extends UseCaseSet<Quiz, IQuizRepository> {

    constructor(rep: IQuizRepository, private entityUseCases: WikiEntityUseCases) {
        super(rep);
    }

    create(data: Quiz): Bluebird<Quiz> {
        if (!data) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        const tasks = [];

        if (data.topics && data.topics.length) {
            data.topics.forEach(topic => tasks.push(this.entityUseCases.create(topic).catch(catchError(DataConflictError))));
        }

        return Bluebird.all(tasks).then(() => {
            return super.create(data).then(quiz => {
                if (quiz.topics && quiz.topics.length) {
                    return Bluebird.each(quiz.topics, topic => {
                        return this.setTopicCountQuizzes(topic.id);
                    }).then(() => quiz);
                }

                return quiz;
            });
        });
    }

    setTopicCountQuizzes(topicId: string): Bluebird<number> {
        return this.repository.countByTopicId(topicId).then(count => {
            return this.entityUseCases.update({ id: topicId, countQuizzes: count }).then(() => count);
        });
    }

}
