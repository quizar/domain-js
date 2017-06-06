
export type IPlainObject<T> = { [index: string]: T }
export type PlainObject = IPlainObject<any>;

function checkField(name: string) {
    if (typeof name !== 'string') {
        throw new Error('Invalid entity fieldName');
    }
}

export interface IEntity {
    set<T>(fieldName: string, fieldValue: T);
    get<T>(fieldName: string): T;
    setFields(fields: PlainObject);
    toJSON(fieldNames?: string[]): PlainObject;
}

/**
 * Entity base class
 */
export abstract class Entity implements IEntity {
    private _fields: PlainObject = {};
    // private _keys?: any;

    constructor(fields?: PlainObject) {
        if (fields) {
            if (typeof fields !== 'object') {
                throw new Error('`fields` param must be an oject');
            }
            this.setFields(fields);
        }
    }

    get<T>(fieldName: string): T {
        checkField(fieldName);

        return this._fields[fieldName];
    }

    set<T>(fieldName: string, fieldValue: T) {
        checkField(fieldName);

        this._fields[fieldName] = fieldValue;
    }

    setFields(fields: PlainObject) {
        for (var prop in fields) {
            if (fields.hasOwnProperty(prop)) {
                this.set(prop, fields[prop]);
            }
        }
    }

    toJSON(fieldNames?: string[]): PlainObject {
        const fields: PlainObject = {};

        for (let prop in this._fields) {
            if (fieldNames && fieldNames.indexOf(prop) < 0) {
                continue;
            }
            let value = this._fields[prop];
            // recursive toJSON
            value = localToJSON(value);

            if (undefined !== value) {
                fields[prop] = value;
            }
        }

        return fields;
    }
}

function localToJSON(value: any): any {
    if (~[null, undefined].indexOf(value)) {
        return value;
    }
    if (typeof value.toJSON === 'function') {
        value = value.toJSON();
    } else if (Array.isArray(value)) {
        return value.map(item => localToJSON(item));
    }
    return value;
}