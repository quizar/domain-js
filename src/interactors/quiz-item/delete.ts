
import { Bluebird } from '../../utils';
import { QuizItem } from '../../entities';
import { Repository } from '../repository';
import { DeleteUseCase } from '../delete-use-case';

export class DeleteQuizItem extends DeleteUseCase {
    constructor(repository: Repository<QuizItem>) {
        super('DeleteQuizItem', repository);
    }
}
