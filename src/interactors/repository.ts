
import { Bluebird, IPlainObject } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';
import { DataKeys } from './data-keys';

export interface RepAccessOptions {
    /**
     * Fields to return separated by spaces
     */
    fields?: string[]
}

export interface RepUpdateOptions extends RepAccessOptions {

}

export interface RepUpdateData<T> {
    item: T
    delete?: (keyof T)[]
    // inc?: { [index: string]: number }
}

export interface RootRepository {
    remove(id: string): Bluebird<boolean>
    exists(id: string): Bluebird<boolean>
    count(keys?: DataKeys): Bluebird<number>
}

export interface Repository<T> extends RootRepository {
    create(data: T, options?: RepAccessOptions): Bluebird<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T>
    get(keys: DataKeys, options?: RepAccessOptions): Bluebird<T>
    list(keys: DataKeys, options?: RepAccessOptions): Bluebird<T[]>

    getById(id: string, options?: RepAccessOptions): Bluebird<T>
}

export interface QuizItemRepository extends Repository<QuizItem> {

}

export interface WikiEntityRepository extends Repository<WikiEntity> {

}

export interface QuizRepository extends Repository<Quiz> {

}
