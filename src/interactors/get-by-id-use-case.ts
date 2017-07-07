
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { Repository, RepAccessOptions } from './repository';

export class GetByIdUseCase<T> extends BaseUseCase<string, T, RepAccessOptions>{
    constructor(name: string, private repository: Repository<T>) {
        super(name);
    }

    protected innerExecute(id: string, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.getById(id, options);
    }
}
