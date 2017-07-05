
import { Bluebird, IPlainObject } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

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

// const obj: RepUpdateData<WikiEntity> = { item: {} };
// obj.delete=['id'];

export interface RootRepository {
    remove(id: string): Bluebird<boolean>
    exists(id: string): Bluebird<boolean>
}

export interface Repository<T> extends RootRepository {
    create(data: T, options?: RepAccessOptions): Bluebird<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T>
    getById(id: string, options?: RepAccessOptions): Bluebird<T>
}

export interface TopicCountRepository<T> extends Repository<T> {
    countByTopicId(topicId: string): Bluebird<number>
}

export interface QuizItemRepository extends TopicCountRepository<QuizItem> {
}

export interface WikiEntityRepository extends Repository<WikiEntity> {

}

export interface QuizRepository extends TopicCountRepository<Quiz> {

}
