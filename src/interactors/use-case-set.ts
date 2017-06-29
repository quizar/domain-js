
import { Bluebird } from '../utils';
import { IRepository, RepAccessOptions } from './repository';

export class UseCaseSet<T, R extends IRepository<T>> implements IRepository<T> {

    constructor(public readonly repository: R) {
    }

    create(data: T, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.create(data, options);
    }

    update<O>(data: T, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.update(data, options);
    }

    remove(id: string): Bluebird<boolean> {
        return this.repository.remove(id);
    }

    getById<O>(id: string, options?: RepAccessOptions): Bluebird<T> {
        return this.repository.getById(id, options);
    }
}