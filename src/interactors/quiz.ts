
import { Quiz } from '../entities/quiz'
import { Promise, IBaseRepository } from '../utils'

export interface IQuizRepository extends IBaseRepository<Quiz> {

}

export const QuizUseCases = {
    create: (data: Quiz, rep: IQuizRepository): Promise<Quiz> => {
        if (!data) {
            return Promise.reject(new Error('Invalid data'));
        }
        return rep.create(data)
    },

    update: (data: Quiz, rep: IQuizRepository): Promise<Quiz> => {
        return rep.update(data)
    },

    remove: (id: string, rep: IQuizRepository): Promise<boolean> => {
        return rep.remove(id)
    }
}
