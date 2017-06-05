
import { Topic } from '../entities/topic'
import { Promise, IBaseRepository } from '../utils'

export interface ITopicRepository extends IBaseRepository<Topic> {

}

export const TopicUseCases = {
    create: (data: Topic, rep: ITopicRepository): Promise<Topic> => {
        if (!data) {
            return Promise.reject(new Error('Invalid data'));
        }
        return rep.create(data)
    },

    update: (data: Topic, rep: ITopicRepository): Promise<Topic> => {
        return rep.update(data)
    },

    remove: (id: string, rep: ITopicRepository): Promise<boolean> => {
        return rep.remove(id)
    }
}
