
const debug = require('debug')('quizar-domain');
import { Bluebird, md5, _ } from '../../utils';
import { Quiz, WikiEntity, QuizItemInfo } from '../../entities';
import { QuizFields } from '../../entities/entity-fields';
import { Repository, RepAccessOptions, RepUpdateData, RepUpdateOptions } from '../repository';
import { BaseUseCase } from '../use-case';
import { validate } from '../../entities/validator';
import { createQuizItemInfo } from '../../entities/validate-schema';
import { DataValidationError, DataConflictError, DataNotFoundError } from '../../errors';
import { CreateEntity, UpdateEntity } from '../entity';
import { prepareTopics, formatPropertyEntities, notExistsQuizItems } from '../helpers';
import { UpdateQuiz } from './update';

export type RemoveQuizItemData = {
    quizId: string
    quizItemId: string
}

export class RemoveQuizItem extends BaseUseCase<RemoveQuizItemData, boolean, null>{

    constructor(private repository: Repository<Quiz>, private updateQuiz: UpdateQuiz) {
        super('RemoveQuizItem');
    }

    protected innerExecute(data: RemoveQuizItemData): Bluebird<boolean> {
        const quizId = data.quizId;
        const quizItemId = data.quizItemId;

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

            return this.updateQuiz.execute({ item: { id: quizId, items: quiz.items } }).return(true);
        });
    }

    protected validateData(data: RemoveQuizItemData): Bluebird<RemoveQuizItemData> {
        return Bluebird.resolve(data);
    }
}
