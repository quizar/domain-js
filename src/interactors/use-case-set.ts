
import { Promise } from '../utils';
import { IRepository } from './repository';

export class UseCaseSet<T, R extends IRepository<T>> implements IRepository<T> {
    protected rep: R

    constructor(rep: R) {
        this.rep = rep;
    }

    create(data: T): Promise<T> {
        return this.rep.create(data)
    }

    update(data: T): Promise<T> {
        return this.rep.update(data)
    }

    remove(id: string): Promise<boolean> {
        return this.rep.remove(id)
    }
}