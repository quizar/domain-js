
import { QuizItem, WikiEntity, Quiz, Topic } from '../entities';

export interface IRepository<T> {
    create: (data: T) => Promise<T>
    update: (data: T) => Promise<T>
    remove: (id: string) => Promise<boolean>
}

export interface IQuizItemRepository extends IRepository<QuizItem> {

}

export interface IWikiEntityRepository extends IRepository<WikiEntity> {

}

export interface IQuizRepository extends IRepository<Quiz> {

}

export interface ITopicRepository extends IRepository<Topic> {

}
