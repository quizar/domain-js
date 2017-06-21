
import { Promise } from '../utils';
import { IRepository } from './repository';

export class UseCaseSet<T, R extends IRepository<T>> implements IRepository<T> {

    constructor(public readonly repository: R) {
    }

    create<O>(data: T, options?: O): Promise<T> {
        return this.repository.create(data, options);
    }

    update<O>(data: T, options?: O): Promise<T> {
        return this.repository.update(data, options);
    }

    remove<O>(id: string, options?: O): Promise<boolean> {
        return this.repository.remove(id, options);
    }

    getById<O>(id: string, options?: O): Promise<T> {
        return this.repository.getById(id, options);
    }
}