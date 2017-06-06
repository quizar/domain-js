
import { Promise, IBaseRepository } from '../utils'

export class UseCaseSet<T, R extends IBaseRepository<T>> {
    protected rep: R

    constructor(rep: R) {
        this.rep = rep;
    }
    
    create(data: T): Promise<T> {
        if (!data) {
            return Promise.reject(new Error('Invalid data'));
        }
        return this.rep.create(data)
    }

    update(data: T): Promise<T> {
        return this.rep.update(data)
    }

    remove(id: string): Promise<boolean> {
        return this.rep.remove(id)
    }
}