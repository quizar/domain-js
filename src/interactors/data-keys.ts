
import { createEnum } from '../utils';

export interface IndexKey {
    readonly name: string
    readonly value: string | number
}

export const SortDirection = createEnum(['ASC', 'DESC']);
export type SortDirection = keyof typeof SortDirection;

export interface SortKey extends IndexKey {
    direction?: SortDirection
}

export interface DataKeys {
    readonly indexKeys: IndexKey[]
    readonly sortKeys?: SortKey[]
}

export class BaseDataKeys implements DataKeys {
    readonly indexKeys: IndexKey[]
    readonly sortKeys?: SortKey[]

    constructor(indexKeys: IndexKey[] | IndexKey, sortKeys?: IndexKey[] | IndexKey) {
        this.indexKeys = Array.isArray(indexKeys) ? indexKeys : [indexKeys];
        if (sortKeys) {
            this.sortKeys = Array.isArray(sortKeys) ? sortKeys : [sortKeys];
        }
    }

    add(keys: DataKeys) {
        keys.indexKeys.forEach(key => this.indexKeys.push(key));
        if (keys.sortKeys) {
            keys.sortKeys.forEach(key => this.sortKeys.push(key));
        }
    }
}

export class IdUniqueKey extends BaseDataKeys {
    constructor(id: string) {
        super({ name: 'id', value: id });
    }

    static create(id: string) {
        return new IdUniqueKey(id);
    }
}

export class TopicIdIndexKey extends BaseDataKeys {
    constructor(id: string) {
        super({ name: 'topicId', value: id });
    }

    static create(id: string) {
        return new TopicIdIndexKey(id);
    }
}
