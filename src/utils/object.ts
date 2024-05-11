import { toStringPath } from "./string";

/**
 * 檢查物件是否為空
 * @param data
 * @returns
 */
export function isObjectNullOrEmpty(data: unknown) {
  if (!data) return true;
  if (data instanceof Array) return data.length === 0;
  if (data instanceof Map) return data.size === 0;
  if (data instanceof Object) return Object.keys(data).length === 0;
  return !data;
}

export function isSet(data: unknown) {
  if (typeof data === "undefined") return false;
  if (typeof data === "string") return data !== "";
  if (typeof data === "number") return data !== 0;
  return;
}

export function deepClone<T>(val: T): T {
  const cache = new WeakMap();

  function _deepClone<K>(val: K): K {
    if (!isObject(val)) return val;
    const result = (Array.isArray(val) ? [] : {}) as any;

    if (cache.has(val)) return cache.get(val);

    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        result[key] = _deepClone(val[key]);
      }
    }
    return result as K;
  }

  return _deepClone(val);
}

export function isObject<T>(v: T): v is NotNullObject<T> {
  return typeof v === "object" && v !== null;
}

export function isObjectEqual(obj1: any, obj2: any) {
  // console.log("obj1, obj2 :>> ", obj1, obj2);
  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!isObjectEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  } else {
    return obj1 === obj2;
  }
}

export function pickObjectFromPath(paths: string[] | string, obj: any, handler: (obj: any) => any = (obj) => obj): any {
  if (typeof paths === "string") paths = toStringPath(paths);

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
}

/**
 * 依照路徑取得該路徑的值 沒有返回undefined
 * @param paths
 * @param obj
 * @returns
 */
export function getObject(paths: string | string[], obj: any): any {
  if (typeof paths === "string") paths = toStringPath(paths);
  for (const key of paths) {
    if (!obj) return;
    obj = obj[key];
  }
  return obj;
}

/**
 * 依照路徑設置該路徑目標的值 若途中遇到非Object物件，將會轉為{}
 * @param paths
 * @param obj
 * @param value
 * @returns
 */
export function setObject(paths: string | string[], obj: any, value: any = null): any {
  if (typeof paths === "string") paths = toStringPath(paths);
  const parentPath = paths.slice(0, paths.length - 1);
  const targetKey = paths[paths.length - 1];
  obj = Object.createFromPath(parentPath, obj);
  obj[targetKey] = value;
  return obj;
}

/**
 * 依照路徑建立空物件({})
 * @param paths
 * @param obj
 * @returns
 */
export function createObjectFromPath(paths: string | string[], obj: any): any {
  if (typeof paths === "string") paths = toStringPath(paths);
  for (let i = 0, len = paths.length; i < len; i++) {
    const key = paths[i];
    obj[key] ||= {};
    obj = obj[key];
  }
  return obj;
}

interface MergeOptions {
  onDuplicate?: "logical-or" | ((newVal: any, originalVal: any, key: string) => any);
}
export function mergeObject(obj: any, sources: any, options: MergeOptions = {}): any {
  obj ||= {};
  const onDuplicate = (() => {
    const _onDuplicate = options.onDuplicate;
    if (typeof _onDuplicate === "function") return _onDuplicate;

    const defaultHandler = (val: any) => {
      return val;
    };
    return (
      {
        "logical-or": (newVal: any, originalVal: any) => newVal || originalVal,
        default: defaultHandler,
      }[_onDuplicate || "default"] || defaultHandler
    );
  })();
  const _merge = (targetObj: any) => {
    if (!isObject(targetObj)) {
      return obj;
    }
    const keys1 = Object.keys(obj);
    const keys2 = Object.keys(targetObj);

    const uniqueKeys = new Set([...keys1, ...keys2]);
    for (const key of uniqueKeys) {
      const keys1HasKey = keys1.includes(key);
      const keys2HasKey = keys2.includes(key);
      const newVal = targetObj[key];
      const oldVal = obj[key];
      if (keys1HasKey && keys2HasKey) {
        obj[key] = onDuplicate(newVal, oldVal, key);
        // console.log("key, obj[key] :>> ", key, obj[key]);
        // 重複
      } else if (keys2HasKey) {
        obj[key] = newVal;
      }
    }
  };

  if (!Array.isArray(sources)) sources = [sources];

  for (const obj of sources) {
    _merge(obj);
  }
  return obj;
}

export function flatTree<T>(tree: T[], getChildren = (item: T) => (item as any).children as T[] | undefined): T[] {
  return [
    ...new Set(
      tree.reduce(
        (acc, item) => {
          const children = getChildren(item);
          return acc.concat(children ? flatTree(children) : item);
        },
        [...tree],
      ),
    ),
  ];
}
