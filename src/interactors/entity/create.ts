
import { Bluebird } from '../../utils';
import { WikiEntity } from '../../entities';
import { Repository } from '../repository';
import { CreateUseCase } from '../create-use-case';
import { WikiEntityValidator } from '../../entities/validator';

export class EntityCreate extends CreateUseCase<WikiEntity>{
    constructor(repository: Repository<WikiEntity>) {
        super('EntityCreate', repository, WikiEntityValidator.instance);
    }
}
