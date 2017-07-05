
import { Bluebird } from '../../utils';
import { WikiEntity } from '../../entities';
import { Repository } from '../repository';
import { UpdateUseCase } from '../update-use-case';
import { WikiEntityValidator } from '../../entities/validator';

export class UpdateEntity extends UpdateUseCase<WikiEntity>{
    constructor(repository: Repository<WikiEntity>) {
        super('UpdateEntity', repository, WikiEntityValidator.instance);
    }
}
