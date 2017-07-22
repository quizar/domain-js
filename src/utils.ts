
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { createHash } from 'crypto';
const slugFn = require('mollusc');
const atonicObj = require('atonic');

export { Bluebird, _ }

export type PlainObject<T> = {
  [index: string]: T
}

export type AnyPlainObject = PlainObject<any>
export type StringPlainObject = PlainObject<string>

/** Utility function to create a K:V from a list of strings */
export function createEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export function isEntityId(id: string) {
  return /^Q\d+$/.test(id);
}

export function md5(data: string): string {
  return createHash('MD5').update(data, 'utf8').digest('hex');
}

export function slug(str: string): string {
  return slugFn(atonicObj.lowerCase(str.toLowerCase()));
}
