
import * as Bluebird from 'bluebird'

export const Promise = Bluebird

export interface IBaseRepository<T> {
    create: (data: T) => Promise<T>
    update: (data: T) => Promise<T>
    remove: (id: string) => Promise<boolean>
}
