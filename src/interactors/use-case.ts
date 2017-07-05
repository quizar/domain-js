
const debug = require('debug')('quizar-domain');
import { Bluebird, createEnum } from '../utils';

export interface UseCase<DATA, RESULT, OPTIONS> {
    execute(data: DATA, options?: OPTIONS): Bluebird<RESULT>
}

export abstract class BaseUseCase<DATA, RESULT, OPTIONS> implements UseCase<DATA, RESULT, OPTIONS> {

    constructor(protected readonly name: string) { }

    execute(data: DATA, options?: OPTIONS): Bluebird<RESULT> {
        debug('start executing of use case ' + this.name);

        return this.initData(data)
            .then(idata => this.validateData(idata))
            .then(vdata => this.innerExecute(vdata, options))
            .then(result => {
                debug('end execution of use case ' + this.name);
                return result;
            });
    }

    protected initData(data: DATA): Bluebird<DATA> {
        return Bluebird.resolve(data);
    }

    protected validateData(data: DATA): Bluebird<DATA> {
        return Bluebird.resolve(data);
    }

    protected abstract innerExecute(data: DATA, options?: OPTIONS): Bluebird<RESULT>
}
