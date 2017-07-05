
import { Bluebird } from '../utils';
import { Repository, RepAccessOptions, RepUpdateOptions, RepUpdateData } from './repository';
import { BaseValidator } from '../entities/validator';

export class UseCaseSet<T, R extends Repository<T>> {

    constructor(protected readonly repository: R, private validator: BaseValidator<T>) {
    }

    create(data: T, options?: RepAccessOptions): Bluebird<T> {
        return Bluebird.try(() => this.validator.create(data)).then((vdata) => this.repository.create(vdata, options));
    }

    update(data: T, options?: RepUpdateOptions): Bluebird<T> {
        return this.repUpdate({ item: data }, options);
    }

    repUpdate(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T> {
        return Bluebird.try(() => this.validator.update(data)).then((vdata) => this.repository.update(vdata, options));
    }

    remove(id: string): Bluebird<boolean> {
        return this.repository.remove(id);
    }

    getById(id: string, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.getById(id, options);
    }
}