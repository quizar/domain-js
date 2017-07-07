
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { WikiEntity } from '../entities';
import { RootRepository, RepAccessOptions, RepGetData } from './repository';

export class GetCountUseCase extends BaseUseCase<RepGetData, number, undefined>{
    constructor(name: string, private repository: RootRepository) {
        super(name);
    }

    protected innerExecute(data: RepGetData): Bluebird<number> {
        return this.repository.count(data);
    }
}
