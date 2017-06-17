
import { QuizItem, WikiEntity, Quiz, QuizItemInfo } from '../entities';

export interface IRepository<T> {
    create<O>(data: T, options?: O): Promise<T>
    update<O>(data: T, options?: O): Promise<T>
    remove<O>(id: string, options?: O): Promise<boolean>
}

export interface IQuizItemRepository extends IRepository<QuizItem> {

}

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export interface IQuizRepository extends IRepository<Quiz> {
    addQuizItem(quizId: string, quizItem: QuizItemInfo): Promise<boolean>
    addQuizItem(quizId: string, quizItemId: string): Promise<boolean>
}
