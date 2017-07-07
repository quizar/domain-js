
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { WikiEntity } from '../entities';
import { Repository, RepAccessOptions, RepGetData } from './repository';

export class GetOneUseCase<T> extends BaseUseCase<RepGetData, T, RepAccessOptions>{
    constructor(name: string, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(data: RepGetData, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.one(data, options);
    }
}
