
import { QuizItem, WikiEntity } from '../entities';
import { Promise } from '../utils';
import { UseCaseSet } from './use-case-set';
import { IRepository, IQuizItemRepository } from './repository';
import { WikiEntityUseCases } from './wiki-entity';
import { DataValidationError, DataConflictError, catchError } from '../errors';

export class QuizItemUseCases extends UseCaseSet<QuizItem, IQuizItemRepository> {

    constructor(rep: IQuizItemRepository, private entityUseCases: WikiEntityUseCases) {
        super(rep);
    }

    create(data: QuizItem): Promise<QuizItem> {
        if (!data) {
            return Promise.reject(new DataValidationError({ message: 'Invalid data' }));
        }
        const tasks = [];

        if (data.entity) {
            tasks.push(this.entityUseCases.create(data.entity).catch(catchError(DataConflictError)));
        }

        if (data.value && data.value.entity) {
            tasks.push(this.entityUseCases.create(data.value.entity).catch(catchError(DataConflictError)));
        }

        return Promise.all(tasks).then(() => {
            return super.create(data);
        });
    }
}
