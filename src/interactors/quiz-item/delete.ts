
import { Bluebird } from '../../utils';
import { QuizItem } from '../../entities';
import { Repository } from '../repository';
import { DeleteUseCase } from '../delete-use-case';

export class QuizItemDelete extends DeleteUseCase {
    constructor(repository: Repository<QuizItem>) {
        super('QuizItemDelete', repository);
    }
}
