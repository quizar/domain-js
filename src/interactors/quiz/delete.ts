
import { Bluebird } from '../../utils';
import { Quiz } from '../../entities';
import { Repository } from '../repository';
import { DeleteUseCase } from '../delete-use-case';

export class DeleteQuiz extends DeleteUseCase {
    constructor(repository: Repository<Quiz>) {
        super('DeleteQuiz', repository);
    }
}
