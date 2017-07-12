
import { Bluebird, _ } from '../utils';
import { WikiEntity, QuizItem } from '../entities';
import { QuizItemFields } from '../entities/entity-fields';
import { DataValidationError } from '../errors';
import { QuizItemRepository } from './repository';

export function prepareTopics(topics: WikiEntity[]): Bluebird<WikiEntity[]> {
    if (!topics || !topics.length) {
        return Bluebird.resolve([]);
    }
    const utopics = _.uniqBy(topics, 'id');
    if (utopics.length !== topics.length) {
        return Bluebird.reject(new DataValidationError({ message: '`topics` must contain unique items' }));
    }
    return Bluebird.resolve(topics);
}

export function formatPropertyEntities(data: QuizItem): WikiEntity[] {
    const entities: WikiEntity[] = [];

    if (data.property && data.property.entity) {
        entities.push(data.property.entity);
    }
    if (data.qualifier && data.qualifier.entity) {
        entities.push(data.qualifier.entity);
    }

    return entities;
}

export function notExistsQuizItems(quizItemRep: QuizItemRepository, items: string[]): Bluebird<string[]> {
    items = items || [];
    if (items.length === 0) {
        return Bluebird.resolve([]);
    }
    return Bluebird.map(items, item => quizItemRep.getById(item, { fields: [QuizItemFields.id] }).then(quizItem => (!!quizItem) ? null : item)).then(result => result.filter(item => !!item));
}
