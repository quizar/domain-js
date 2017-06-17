
import { Promise } from '../utils';
import { IRepository } from './repository';

export class UseCaseSet<T, R extends IRepository<T>> implements IRepository<T> {
    protected rep: R

    constructor(rep: R) {
        this.rep = rep;
    }

    create<O>(data: T, options?: O): Promise<T> {
        return this.rep.create(data, options);
    }

    update<O>(data: T, options?: O): Promise<T> {
        return this.rep.update(data, options);
    }

    remove<O>(id: string, options?: O): Promise<boolean> {
        return this.rep.remove(id, options);
    }
}