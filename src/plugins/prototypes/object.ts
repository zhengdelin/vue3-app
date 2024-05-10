import {
  deepClone,
  isObjectNullOrEmpty,
  isObject,
  isObjectEqual,
  getObject,
  setObject,
  createObjectFromPath,
  pickObjectFromPath,
  mergeObject,
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
