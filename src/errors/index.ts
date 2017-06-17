
import { Promise } from '../utils';

export * from './errors';
export * from './convert-error';

export function catchErrorType(type) {
    return function (error): Promise<void> {
        if (error instanceof type) {
            return Promise.resolve();
        } else {
            return Promise.reject(error);
        }
    }
}
