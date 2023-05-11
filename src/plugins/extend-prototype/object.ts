export {};

type NotNullObject<T> = NonNullable<T> extends object ? NonNullable<T> : never;

declare global {
  interface ObjectConstructor {
    isObject<T>(v: T): v is NotNullObject<T>;
    isEqual(val1: any, val2: any): boolean;
    pickFromPath(paths: string[] | string, obj: any, handler?: (obj: any) => any): any;
    get(paths: string | string[], obj: any): any;
    set(paths: string | string[], obj: any, value?: any): any;
    createFromPath(paths: string | string[], obj: any): any;
  }
}

Object.isObject = function <T>(v: T): v is NotNullObject<T> {
  return typeof v === "object" && v !== null;
};

Object.isEqual = function (obj1, obj2) {
  // console.log("obj1, obj2 :>> ", obj1, obj2);
  if (Object.isObject(obj1) && Object.isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!Object.isEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  } else {
    return obj1 === obj2;
  }
};

Object.pickFromPath = function (paths, obj, handler = (obj) => obj) {
  if (typeof paths === "string") paths = paths.toPath();

  const result = {};
  function pick(result: Record<string, any>, paths: string[], obj: any): any {
    const [key, ...restPath] = paths;
    if (restPath.length === 0) {
      result[key] = handler(obj[key]);
    } else {
      result[key] = {};
      pick(result[key], restPath, obj[key]);
    }
  }
  pick(result, paths, obj);
  return result;
};

/**
 * 依照路徑取得該路徑的值 沒有返回undefined
 * @param paths
 * @param obj
 * @returns
 */
Object.get = function (paths, obj) {
  if (typeof paths === "string") paths = paths.toPath();
  for (const key of paths) {
    if (!obj) return;
    obj = obj[key];
  }
  return obj;
};

/**
 * 依照路徑設置該路徑目標的值 若途中遇到非Object物件，將會轉為{}
 * @param paths
 * @param obj
 * @param value
 * @returns
 */
Object.set = function (paths, obj, value = null) {
  if (typeof paths === "string") paths = paths.toPath();
  const parentPath = paths.slice(0, paths.length - 1);
  const targetKey = paths[paths.length - 1];
  obj = Object.createFromPath(parentPath, obj);
  obj[targetKey] = value;
  return obj;
};

/**
 * 依照路徑建立空物件({})
 * @param paths
 * @param obj
 * @returns
 */
Object.createFromPath = function (paths, obj) {
  if (typeof paths === "string") paths = paths.toPath();
  for (let i = 0, len = paths.length; i < len; i++) {
    const key = paths[i];
    obj[key] ||= {};
    obj = obj[key];
  }
  return obj;
};
