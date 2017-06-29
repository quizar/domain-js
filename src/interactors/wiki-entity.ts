
import { WikiEntity } from '../entities'
// import { Bluebird } from '../utils'
import { UseCaseSet } from './use-case-set'
import { IRepository, IWikiEntityRepository } from './repository';

export class WikiEntityUseCases extends UseCaseSet<WikiEntity, IWikiEntityRepository> {

}
