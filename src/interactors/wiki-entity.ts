
import { WikiEntity } from '../entities'
// import { Bluebird } from '../utils'
import { UseCaseSet } from './use-case-set'
import { Repository, WikiEntityRepository } from './repository';
import { WikiEntityValidator } from '../entities/validator';

export class WikiEntityUseCases extends UseCaseSet<WikiEntity, WikiEntityRepository> {
    constructor(rep: WikiEntityRepository) {
        super(rep, WikiEntityValidator.instance);
    }
}
