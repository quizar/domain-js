
import { Bluebird, _ } from '../utils';
import { WikiEntity, QuizItem } from '../entities';
import { DataValidationError } from '../errors';

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
