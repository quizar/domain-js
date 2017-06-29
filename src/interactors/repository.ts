
import { Bluebird } from '../utils';
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

export interface IRepository<T> {
    create<O>(data: T, options?: O): Bluebird<T>
    update<O>(data: T, options?: O): Bluebird<T>
    remove<O>(id: string, options?: O): Bluebird<boolean>
    getById<O>(id: string, options?: O): Bluebird<T>
}

export interface IQuizItemRepository extends IRepository<QuizItem> {
    countByTopicId(topicId: string): Bluebird<number>
}

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export interface IQuizRepository extends IRepository<Quiz> {
    // addQuizItem(quizId: string, quizItem: QuizItemInfo): Promise<boolean>
    // addQuizItem(quizId: string, quizItemId: string): Promise<boolean>
    countByTopicId(topicId: string): Bluebird<number>
}
