import { arrayChunk, arrayGroupBy, arrayMapBy, HandledArray, KeyHandler, ResolveHandler } from "@/utils/array";
export {};

// type ArrayFuncRestArgs<T> = T extends (...args: infer P) => any ? (P extends [any, ...infer RestArgs] ? RestArgs : P) : never;

declare global {
  interface Array<T> {
    groupBy<K extends KeyHandler<T> | keyof T>(keyHandlerOrKey: K): HandledArray<T, K, T[]>;
    mapBy<K extends KeyHandler<T> | keyof T, U = T>(
      keyHandler: K,
      resolveHandler?: ResolveHandler<T, U>,
    ): HandledArray<T, K, U>;
    chunk(size: number): T[][];
  }
}

Array.prototype.groupBy = function (keyHandler) {
  return arrayGroupBy(this, keyHandler);
};

Array.prototype.mapBy = function (keyHandler, resolveHandler) {
  return arrayMapBy(this, keyHandler, resolveHandler);
};

Array.prototype.chunk = function (size) {
  return arrayChunk(this, size);
};
