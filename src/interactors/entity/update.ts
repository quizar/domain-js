
import { Bluebird } from '../../utils';
import { WikiEntity } from '../../entities';
import { Repository } from '../repository';
import { UpdateUseCase } from '../update-use-case';
import { WikiEntityValidator } from '../../entities/validator';

export class EntityUpdate extends UpdateUseCase<WikiEntity>{
    constructor(repository: Repository<WikiEntity>) {
        super('EntityUpdate', repository, WikiEntityValidator.instance);
    }
}
