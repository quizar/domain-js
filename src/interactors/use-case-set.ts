
import { Bluebird } from '../utils';
import { IRepository, RepAccessOptions, RepUpdateOptions } from './repository';
import { IValidator } from '../entities/validator';

export class UseCaseSet<T, R extends IRepository<T>> {

    constructor(public readonly repository: R, private validator: IValidator<T>) {
    }

    create(data: T, options?: RepAccessOptions): Bluebird<T> {
        return Bluebird.try(() => this.validator.create(data)).then((vdata) => this.repository.create(vdata, options));
    }

    update(data: T, options?: RepUpdateOptions): Bluebird<T> {
        return Bluebird.try(() => this.validator.update({ item: data })).then((vdata) => this.repository.update(vdata, options));
    }

    remove(id: string): Bluebird<boolean> {
        return this.repository.remove(id);
    }

    getById(id: string, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.getById(id, options);
    }
}