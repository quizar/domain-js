
import { IPlainObject } from '../utils';

export type MapInfo = IPlainObject<string | string[]>;
export type TypeMapInfo = { toDomainEntity: MapInfo, fromDomainEntity: MapInfo };

export class EntityMapperContainer {
    private MAPPERS_INFO: IPlainObject<TypeMapInfo> = {};

    constructor(private validTypeNames: string[] = ['QuizItem', 'Quiz', 'WikiEntity']) {

    }

    getMapInfo(typeName: string): TypeMapInfo {
        this.checkTypeName(typeName);

        return this.MAPPERS_INFO[typeName];
    }

    createType(typeName: string): { add(from: string, to?: string | string[]): void } {
        this.checkTypeName(typeName);

        const self = this;

        if (self.MAPPERS_INFO[typeName]) {
            throw new Error('Name `' + typeName + '` exists!');
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
            throw new Error('Invalid type name: ' + name);
        }
    }
}
