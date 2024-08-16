type ObjectKeyType = string | number | symbol;
type FunctionWithArgs = (...args: any) => any;

/**
 * 表示一個處理類型為 `T` 的鍵並返回類型為 `K` 的值的函數。
 */
export type KeyHandler<T, K = any> = (item: T) => K;

/**
 * 表示一個將類型為 `T` 的項目解析為類型為 `K` 的鍵的函數。
 */
export type ResolveHandler<T, K> = (item: T) => K;

export type MakeRecord<KeyT, ValueT> = KeyT extends ObjectKeyType ? Record<KeyT, ValueT> : never;
export type HandledArray<T, K extends KeyHandler<T> | keyof T, ValueT> = K extends keyof T
  ? MakeRecord<T[K], ValueT>
  : K extends FunctionWithArgs
  ? MakeRecord<ReturnType<K>, ValueT>
  : never;

/**
 * 基於提供的鍵處理函數將一個項目陣列進行分組。
 */
function arrayGroupBy<T, K extends KeyHandler<T> | keyof T>(arr: T[], keyHandlerOrKey: K): HandledArray<T, K, T[]> {
  const keyHandler = (
    typeof keyHandlerOrKey === "function" ? keyHandlerOrKey : (item: T) => item[keyHandlerOrKey as keyof T]
  ) as KeyHandler<T>;
  const group = {} as any;
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const key = keyHandler(item);
    group[key] = group[key] || [];
    group[key].push(item);
  }
  return group;
}

/**
 * 將一個陣列轉換為映射，對每個值應用解析處理函數。
 */
function arrayMapBy<T, K extends KeyHandler<T> | keyof T, U = T>(
  arr: T[],
  keyHandlerOrKey: K,
  resolveHandler?: ResolveHandler<T, U>,
): HandledArray<T, K, U> {
  resolveHandler ||= (item: T) => item as unknown as U;
  const keyHandler = (
    typeof keyHandlerOrKey === "function" ? keyHandlerOrKey : (item: T) => item[keyHandlerOrKey as keyof T]
  ) as KeyHandler<T>;
  const map = {} as any;
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const key = keyHandler(item);
    map[key] = resolveHandler(item);
  }
  return map;
}

/**
 * Splits an array into smaller arrays of a specified size.
 */
function arrayChunk<T>(arr: T[], size: number) {
  const chunks = [] as T[][];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export { arrayChunk, arrayGroupBy, arrayMapBy };
