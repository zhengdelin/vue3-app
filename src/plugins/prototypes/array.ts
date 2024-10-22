import {
  arrayChunk,
  arrayFlatTree,
  ArrayFlatTreeTransform,
  arrayGroupBy,
  arrayMapBy,
  arrayToTree,
  ArrayToTreeOptions,
  ArrayToTreeResult,
  HandledArray,
  KeyHandler,
  ResolveHandler,
} from "@/utils/array";
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

    toTree<ChildrenKey extends keyof any = "children">(
      options: ArrayToTreeOptions<T, ChildrenKey>,
    ): ArrayToTreeResult<T, ChildrenKey>[];

    flatTree<K = T>(childrenKey: keyof T, transform: ArrayFlatTreeTransform<T, K>): K[];
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

Array.prototype.toTree = function (options) {
  return arrayToTree(this, options);
};

Array.prototype.flatTree = function (childrenKey, transform) {
  return arrayFlatTree(this, childrenKey, transform);
};
