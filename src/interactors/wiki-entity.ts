
import { WikiEntity } from '../entities'
import { Promise } from '../utils'
import { UseCaseSet } from './use-case-set'
import { IRepository } from './repository';

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export class WikiEntityUseCases extends UseCaseSet<WikiEntity, IWikiEntityRepository> {

}
