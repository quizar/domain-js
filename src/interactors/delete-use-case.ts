
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { RootRepository, RepAccessOptions } from './repository';

export class DeleteUseCase extends BaseUseCase<string, boolean, RepAccessOptions>{
    constructor(name: string, protected repository: RootRepository) {
        super(name);
    }

    protected innerExecute(id: string, options?: RepAccessOptions): Bluebird<boolean> {
        return this.repository.remove(id);
    }
}

