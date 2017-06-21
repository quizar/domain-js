
import { DataConflictError } from './errors';

export function convertMongoError(error: any): Error {
    switch (error.code) {
        case 11000:
            return new DataConflictError({ error: error });
        default:
            return error;
    }
}
