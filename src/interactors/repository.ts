
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

export interface IRepository<T> {
    create<O>(data: T, options?: O): Promise<T>
    update<O>(data: T, options?: O): Promise<T>
    remove<O>(id: string, options?: O): Promise<boolean>
    getById<O>(id: string, options?: O): Promise<T>
}

export interface IQuizItemRepository extends IRepository<QuizItem> {
    countByTopicId(topicId: string): Promise<number>
}

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export interface IQuizRepository extends IRepository<Quiz> {
    // addQuizItem(quizId: string, quizItem: QuizItemInfo): Promise<boolean>
    // addQuizItem(quizId: string, quizItemId: string): Promise<boolean>
    countByTopicId(topicId: string): Promise<number>
}
