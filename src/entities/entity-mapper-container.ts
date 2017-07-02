
import { IPlainObject } from '../utils';
import { CodeError } from '../errors';
import { ENTITY_NAMES } from './entities';

export type MapInfo = IPlainObject<string | string[]>;
export type TypeMapInfo = { toDomainEntity: MapInfo, fromDomainEntity: MapInfo };

export interface EntityTypeMapperBuild {
    add(from: string, to?: string | string[]): void
}

export class EntityMapperContainer {
    private MAPPERS_INFO: IPlainObject<TypeMapInfo> = {};

    constructor(private validTypeNames: string[] = [ENTITY_NAMES.Quiz, ENTITY_NAMES.QuizItem, ENTITY_NAMES.WikiEntity]) {

    }

    getMapInfo(typeName: string): TypeMapInfo {
        this.checkTypeName(typeName);

        return this.MAPPERS_INFO[typeName];
    }

    createType(typeName: string): EntityTypeMapperBuild {
        this.checkTypeName(typeName);

        const self = this;

        if (self.MAPPERS_INFO[typeName]) {
            throw new CodeError({ message: 'Name `' + typeName + '` exists!' });
        }
        self.MAPPERS_INFO[typeName] = { toDomainEntity: {}, fromDomainEntity: {} };

        return {
            add(from: string, to?: string | string[]) {
                to = to || from;
                self.MAPPERS_INFO[typeName].fromDomainEntity[from] = to;
                to = Array.isArray(to) ? to[0] : to;
                self.MAPPERS_INFO[typeName].toDomainEntity[to] = from;
            }
        };
    }

    private checkTypeName(name: string) {
        if (this.validTypeNames.indexOf(name) === -1) {
            throw new CodeError({ message: 'Invalid type name: ' + name });
        }
    }
}
