
import { Bluebird, _ } from '../utils';
import { WikiEntity, QuizItem } from '../entities';
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

    if (data.property && data.property.values) {
        data.property.values.forEach(value => {
            if (value.entity) {
                entities.push(value.entity);
            }
            if (value.qualifiers && value.qualifiers.length) {
                value.qualifiers.forEach(qualifier => {
                    if (qualifier.entity) {
                        entities.push(qualifier.entity);
                    }
                });
            }
        });
    }

    return entities;
}

export function notExistsQuizItems(quizItemRep: QuizItemRepository, items: string[]): Bluebird<string[]> {
    items = items || [];
    if (items.length === 0) {
        return Bluebird.resolve([]);
    }
    return Bluebird.map(items, item => quizItemRep.exists(item).then(exists => exists ? null : item)).then(result => result.filter(item => !!item));
}
