
import { Bluebird } from '../utils';
import { BaseUseCase } from './use-case';
import { Repository, RepUpdateData, RepUpdateOptions } from './repository';
import { Validator } from '../entities/validator';

export class UpdateUseCase<RESULT> extends BaseUseCase<RepUpdateData<RESULT>, RESULT, RepUpdateOptions>{

    constructor(name: string, protected repository: Repository<RESULT>, protected validator: Validator<RESULT>) {
        super(name);
    }

    protected innerExecute(data: RepUpdateData<RESULT>, options?: RepUpdateOptions): Bluebird<RESULT> {
        return Bluebird.try(() => this.validator.update(data)).then((vdata) => this.repository.update(vdata, options));
    }

}

