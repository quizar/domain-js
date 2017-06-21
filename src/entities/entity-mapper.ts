
const objectMapper = require('object-mapper');
import { IPlainObject } from '../utils';

export interface IEntityMapper<DE, E> {
    fromDomainEntity(data: DE): E
    toDomainEntity(data: E): DE
}

export type ObjectMapperInfo = IPlainObject<string | string[]>;

export class EntityMapper<DE, E> implements IEntityMapper<DE, E> {

    private fromEntityMap: ObjectMapperInfo;
    private toEntityMap: ObjectMapperInfo;

    constructor(fromEntityMap: ObjectMapperInfo, toEntityMap: ObjectMapperInfo) {
        this.fromEntityMap = fromEntityMap;
        this.toEntityMap = toEntityMap;
    }

    fromDomainEntity(data: DE): E {
        // console.log('map', this.fromEntityMap);
        return EntityMapper.fromDomainEntity<E, DE>(data, this.fromEntityMap);
    }
    toDomainEntity(data: E): DE {
        return EntityMapper.toDomainEntity<DE, E>(data, this.toEntityMap);
    }

    static cleanObject<ST>(obj: ST, ingore: [any] = [null]): ST {
        for (var prop in obj) {
            if (~ingore.indexOf(obj[prop])) {
                delete obj[prop];
            }
        }

        return obj;
    }

    static fromDomainEntity<SE, SDE>(data: SDE, mapInfo: ObjectMapperInfo): SE {
        if (~[null, undefined].indexOf(data)) {
            return null;
        }

        const entity = <SE>objectMapper(data, mapInfo);

        return EntityMapper.cleanObject(entity);
    }

    static toDomainEntity<SDE, SE>(data: SE, mapInfo: ObjectMapperInfo): SDE {
        if (~[null, undefined].indexOf(data)) {
            return null;
        }

        const entity = <SDE>objectMapper(data, mapInfo);

        return EntityMapper.cleanObject(entity);
    }
}
