
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { Repository, RepAccessOptions } from './repository';
import { Validator } from '../entities/validator';

export class CreateUseCase<RESULT> extends BaseUseCase<RESULT, RESULT, RepAccessOptions>{

    constructor(name: string, protected repository: Repository<RESULT>, protected validator: Validator<RESULT>) {
        super(name);
    }

    protected innerExecute(data: RESULT, options?: RepAccessOptions): Bluebird<RESULT> {
        return this.repository.create(data, options);
    }

    protected validateData(data: RESULT): Bluebird<RESULT> {
        return Bluebird.try(() => this.validator.create(data));
    }

}

