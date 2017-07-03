
import { Bluebird, IPlainObject } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

export interface RepAccessOptions {
    /**
     * Fields to return separated by spaces
     */
    fields?: string
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

export interface IRepository<T> {
    create(data: T, options?: RepAccessOptions): Bluebird<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T>
    remove(id: string): Bluebird<boolean>
    getById(id: string, options?: RepAccessOptions): Bluebird<T>
    exists(id: string): Bluebird<boolean>
}

export interface ITopicCountRepository<T> extends IRepository<T> {
    countByTopicId(topicId: string): Bluebird<number>
}

export interface IQuizItemRepository extends ITopicCountRepository<QuizItem> {
}

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export interface IQuizRepository extends ITopicCountRepository<Quiz> {

}
