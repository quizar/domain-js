
const debug = require('debug')('quizar-domain');
import { Bluebird, createEnum } from '../utils';

export interface UseCase<DATA, RESULT, OPTIONS> {
    execute(data: DATA, options?: OPTIONS): Bluebird<RESULT>
}

export abstract class BaseUseCase<DATA, RESULT, OPTIONS> implements UseCase<DATA, RESULT, OPTIONS> {

    constructor(protected readonly name: string) { }

    execute(data: DATA, options?: OPTIONS): Bluebird<RESULT> {
        debug('start executing of use case ' + this.name);

        return this.innerExecute(data, options)
            .then(result => {
                debug('end execution of use case ' + this.name);
                return result;
            });
    }

    protected abstract innerExecute(data: DATA, options?: OPTIONS): Bluebird<RESULT>
}
