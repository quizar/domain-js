
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { WikiEntity } from '../entities';
import { Repository, RepAccessOptions, RepListData } from './repository';

export class GetListUseCase<T> extends BaseUseCase<RepListData, T[], RepAccessOptions>{
    constructor(name: string, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(data: RepListData, options?: RepAccessOptions): Bluebird<T[]> {
        return this.repository.list(data, options);
    }
}
