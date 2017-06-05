
import { QuizItem } from '../entities/quiz-item'
import { Promise, IBaseRepository } from '../utils'

export interface IQuizItemRepository extends IBaseRepository<QuizItem> {

}

export const QuizItemUseCases = {

    create: (data: QuizItem, rep: IQuizItemRepository): Promise<QuizItem> => {
        if (!data) {
            return Promise.reject(new Error('Invalid data'));
        }
        return rep.create(data)
    },

    update: (data: QuizItem, rep: IQuizItemRepository): Promise<QuizItem> => {
        return rep.update(data)
    },

    remove: (id: string, rep: IQuizItemRepository): Promise<boolean> => {
        return rep.remove(id)
    }
}
