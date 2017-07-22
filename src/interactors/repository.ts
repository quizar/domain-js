
import { Bluebird, PlainObject } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo, OneEntityType } from '../entities';
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

export type RepListData = {
    keys: DataKeys
    count: number
}

export interface RepGetData extends DataKeys {

}

export interface RootRepository {
    delete(id: string): Bluebird<boolean>
    // exists(id: string): Bluebird<boolean>
    count(data?: RepGetData): Bluebird<number>
}

export interface Repository<T extends OneEntityType> extends RootRepository {
    create(data: T, options?: RepAccessOptions): Bluebird<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T>
    one(data: RepGetData, options?: RepAccessOptions): Bluebird<T>
    list(data: RepListData, options?: RepAccessOptions): Bluebird<T[]>

    getById(id: string, options?: RepAccessOptions): Bluebird<T>
}

export interface TopicCountRepository<T> extends Repository<T> {
    countByTopicId(topicId: string): Bluebird<number>
}

export interface QuizItemRepository extends TopicCountRepository<QuizItem> {
}

export interface QuizRepository extends TopicCountRepository<Quiz> {
}

export interface WikiEntityRepository extends Repository<WikiEntity> {
}
