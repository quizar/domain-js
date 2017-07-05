
const debug = require('debug')('quizar-domain');
import { Bluebird, md5, _, slug } from '../../utils';
import { Quiz, WikiEntity } from '../../entities';
import { Repository, RepAccessOptions, TopicCountRepository, QuizItemRepository } from '../repository';
import { CreateUseCase } from '../create-use-case';
import { QuizValidator } from '../../entities/validator';
import { DataValidationError, DataConflictError, DataNotFoundError } from '../../errors';
import { CreateEntity, UpdateEntity } from '../entity';
import { prepareTopics, formatPropertyEntities, notExistsQuizItems } from '../helpers';
import { SetTopicCount } from '../set-topic-count';

export class CreateQuiz extends CreateUseCase<Quiz>{
    private setTopicCount: SetTopicCount<Quiz>;

    constructor(repository: TopicCountRepository<Quiz>, private quizItemRepository: QuizItemRepository, private createEntity: CreateEntity, updateEntity: UpdateEntity) {
        super('CreateQuiz', repository, QuizValidator.instance);

        this.setTopicCount = new SetTopicCount<Quiz>(updateEntity, repository, 'countQuizzes');
    }

    static createId(data: Quiz): string {
        try {
            return slug(data.id || data.title.trim()).substr(0, 32).replace(/[^\w\d]+$/, '');
        } catch (e) {
            throw new DataValidationError({ error: e, message: 'title is required' });
        }
    }

    innerExecute(data: Quiz, options?: RepAccessOptions): Bluebird<Quiz> {
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
            data.id = CreateQuiz.createId(data);
        } catch (e) {
            return Bluebird.reject(e);
        }

        return Bluebird.resolve(data);
    }
}
