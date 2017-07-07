
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { Repository, RepAccessOptions, RepGetData, RootRepository } from './repository';

export class ExistsUseCase<T> extends BaseUseCase<string, boolean, undefined>{
    constructor(name: string, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(data: string): Bluebird<boolean> {
        return this.repository.getById(data, { fields: ['id'] }).then(item => !!item);
    }
}
