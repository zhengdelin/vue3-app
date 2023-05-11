export {};

interface KeyHandler<T, U> {
  (item: T): U;
}

interface ResolveHandler<T, K> {
  (item: T): K;
}

declare global {
  interface Array<T> {
    groupBy<U extends keyof any>(keyHandler: KeyHandler<T, U>): { [key in U]: T[] };
    mapBy<U extends keyof any>(keyHandler: KeyHandler<T, U>): { [key in U]: T };
    mapByResolve<U extends keyof any, K>(keyHandler: KeyHandler<T, U>, resolveHandler: ResolveHandler<T, K>): { [key in U]: K };
  }
}

/**
 * Array分組
 * @param keyHandler handler function
 * @returns
 */
Array.prototype.groupBy = function (keyHandler) {
  const group = {} as any;
  for (let i = 0, len = this.length; i < len; i++) {
    const item = this[i];
    const key = keyHandler(item);
    group[key] = group[key] || [];
    group[key].push(item);
  }
  return group;
};

/**
 * Array依照key轉成map
 * @param keyHandler handler function
 * @returns
 */
Array.prototype.mapBy = function (keyHandler) {
  const map = {} as any;
  for (let i = 0, len = this.length; i < len; i++) {
    const item = this[i];
    // console.log("item", item);
    const key = keyHandler(item);
    map[key] = item;
  }
  return map;
};

/**
 * 將陣列轉化為map，並對每個值進行處理
 * @param  handler 依照甚麼key進行分類的函數
 * @param  resolveHandler 對每個陣列進行處理的函數
 * @returns
 */
Array.prototype.mapByResolve = function (keyHandler, resolveHandler) {
  const map = {} as any;
  for (let i = 0, len = this.length; i < len; i++) {
    const key = keyHandler(this[i]);
    map[key] = resolveHandler(this[i]);
  }
  return map;
};
