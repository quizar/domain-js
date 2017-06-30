
import { WikiEntity } from '../entities'
// import { Bluebird } from '../utils'
import { UseCaseSet } from './use-case-set'
import { IRepository, IWikiEntityRepository } from './repository';
import { WikiEntityValidator } from '../entities/validator';

export class WikiEntityUseCases extends UseCaseSet<WikiEntity, IWikiEntityRepository> {
    constructor(rep: IWikiEntityRepository) {
        super(rep, WikiEntityValidator.instance);
    }
}
