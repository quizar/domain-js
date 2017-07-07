
import { Bluebird } from '../../utils';
import { WikiEntity } from '../../entities';
import { Repository } from '../repository';
import { DeleteUseCase } from '../delete-use-case';

export class EntityDelete extends DeleteUseCase {
    constructor(repository: Repository<WikiEntity>) {
        super('EntityDelete', repository);
    }
}
