
import { Bluebird } from '../../utils';
import { WikiEntity } from '../../entities';
import { Repository } from '../repository';
import { DeleteUseCase } from '../delete-use-case';

export class DeleteEntity extends DeleteUseCase {
    constructor(repository: Repository<WikiEntity>) {
        super('DeleteEntity', repository);
    }
}
