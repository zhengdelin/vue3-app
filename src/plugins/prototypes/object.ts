import {
  createObjectFromPath,
  deepClone,
  getObject,
  isObject,
  isObjectEqual,
  isObjectNullOrEmpty,
  mergeObject,
  omit,
  omitBy,
  pick,
  pickBy,
  pickObjectFromPath,
  setObject,
} from "@/utils/object";
export {};

declare global {
  interface ObjectConstructor {
    isObject: typeof isObject;
    isEqual: typeof isObjectEqual;
    pickFromPath: typeof pickObjectFromPath;
    get: typeof getObject;
    set: typeof setObject;
    createFromPath: typeof createObjectFromPath;
    merge: typeof mergeObject;
    deepClone: typeof deepClone;
    isNullOrEmpty: typeof isObjectNullOrEmpty;
    pick: typeof pick;
    omit: typeof omit;
    pickBy: typeof pickBy;
    omitBy: typeof omitBy;
  }
}

Object.isObject = isObject;
Object.isEqual = isObjectEqual;
Object.pickFromPath = pickObjectFromPath;
Object.get = getObject;
Object.set = setObject;
Object.createFromPath = createObjectFromPath;
Object.merge = mergeObject;
Object.deepClone = deepClone;
Object.isNullOrEmpty = isObjectNullOrEmpty;
Object.pick = pick;
Object.omit = omit;
Object.pickBy = pickBy;
Object.omitBy = omitBy;
