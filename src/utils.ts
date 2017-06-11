
import * as Bluebird from 'bluebird'

export const Promise = Bluebird

export type IPlainObject<T> = {
    [index: string]: T
}

export type PlainObject = IPlainObject<any>

/** Utility function to create a K:V from a list of strings */
export function createEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
