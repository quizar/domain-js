
const debug = require('debug')('quizar-domain');
import { Bluebird, md5, _, slug } from '../../utils';
import { Quiz, WikiEntity } from '../../entities';
import { Repository, RepAccessOptions, QuizItemRepository, TopicCountRepository } from '../repository';
import { CreateUseCase } from '../create-use-case';
import { QuizValidator } from '../../entities/validator';
import { DataValidationError, DataConflictError, DataNotFoundError } from '../../errors';
import { EntityCreate, EntityUpdate } from '../entity';
import { prepareTopics, formatPropertyEntities, notExistsQuizItems } from '../helpers';
import { SetTopicCountUseCase } from '../set-topic-count-use-case';

export class QuizCreate extends CreateUseCase<Quiz>{
    private setTopicCount: SetTopicCountUseCase<Quiz>;

    constructor(repository: TopicCountRepository<Quiz>, private quizItemRepository: QuizItemRepository, private createEntity: EntityCreate, updateEntity: EntityUpdate) {
        super('QuizCreate', repository, QuizValidator.instance);

        this.setTopicCount = new SetTopicCountUseCase<Quiz>(updateEntity, repository, 'countQuizzes');
    }

    static createId(data: Quiz): string {
        try {
            return slug(data.id || data.title.trim()).substr(0, 32).replace(/[^\w\d]+$/, '');
        } catch (e) {
            throw new DataValidationError({ error: e, message: 'title is required' });
        }
    }

    protected innerExecute(data: Quiz, options?: RepAccessOptions): Bluebird<Quiz> {
        return prepareTopics(data.topics)
            .map(entity => this.createEntity.execute(entity).catch(DataConflictError, error => debug('trying to add an existing entity')))
            .return(notExistsQuizItems(this.quizItemRepository, data.items && data.items.map(item => item.item.id) || [])
                .then(notExists => {
                    if (notExists.length) {
                        return Bluebird.reject(new DataNotFoundError({ message: `Not found QuizItem id in ${notExists}` }));
                    }
                    return super.innerExecute(data, options).then(quiz => {
                        if (quiz.topics && quiz.topics.length) {
                            return Bluebird.map(quiz.topics, topic => this.setTopicCount.execute(topic.id)).return(quiz);
                        }

                        return quiz;
                    });
                }));
    }

    protected initData(data: Quiz): Bluebird<Quiz> {
        if (!data) {
            return Bluebird.reject(new DataValidationError({ message: 'Invalid data' }));
        }

        try {
            data.id = QuizCreate.createId(data);
        } catch (e) {
            return Bluebird.reject(e);
        }

        return super.initData(data);
    }
}
