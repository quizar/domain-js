
import { Bluebird, IPlainObject } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

export interface RepAccessOptions {
    /**
     * Fields to return separated by spaces
     */
    fieldsToGet?: string
}

export interface RepUpdateOptions extends RepAccessOptions {

}

export interface RepUpdateData<T> {
    item: T,
    remove?: string[]
    inc?: IPlainObject<number>
}

export interface IRepository<T> {
    create(data: T, options?: RepAccessOptions): Bluebird<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Bluebird<T>
    remove(id: string): Bluebird<boolean>
    getById(id: string, options?: RepAccessOptions): Bluebird<T>
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
