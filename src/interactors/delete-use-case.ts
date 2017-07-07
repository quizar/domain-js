
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { RootRepository } from './repository';

export class DeleteUseCase extends BaseUseCase<string, boolean, undefined>{
    constructor(name: string, protected repository: RootRepository) {
        super(name);
    }

    protected innerExecute(id: string): Bluebird<boolean> {
        return this.repository.delete(id);
    }
}

