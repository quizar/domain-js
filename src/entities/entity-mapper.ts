
const objectMapper = require('object-mapper');
const cleanDeep = require('clean-deep');
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
        // console.log('toDomainEntity data', JSON.stringify(data))
        return EntityMapper.toDomainEntity<DE, E>(data, this.toEntityMap);
        // console.log('toDomainEntity r', JSON.stringify(r))
        // return r;
    }

    static cleanObject(obj: any, ignore: [any] = [null]) {
        return cleanDeep(obj, { emptyArrays: false });
        // for (var prop in obj) {
        //     if (Array.isArray(obj[prop])) {
        //         obj[prop] = (obj[prop]).filter(item => ignore.indexOf(item) < 0).map(item => EntityMapper.cleanObject(item));
        //     }
        //     if (~ignore.indexOf(obj[prop]) || Array.isArray(obj[prop]) && !obj[prop]['length'] || typeof obj[prop] === 'object' && !Object.keys(obj[prop]).length) {
        //         delete obj[prop];
        //     }
        // }

        // return obj;
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
