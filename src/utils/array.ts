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

export type ArrayToTreeResult<T, ChildrenKey extends keyof any> = T &
  Record<ChildrenKey, ArrayToTreeResult<T, ChildrenKey>[]>;
export interface ArrayToTreeOptions<T, ChildrenKey extends keyof any> {
  rootId?: any;
  idKey: keyof T;
  pidKey: keyof T;
  childrenKey?: ChildrenKey;
}
function arrayToTree<T, ChildrenKey extends keyof any = "children">(
  arr: T[],
  options: ArrayToTreeOptions<T, ChildrenKey>,
): ArrayToTreeResult<T, ChildrenKey>[] {
  const { idKey, pidKey, childrenKey = "children" as ChildrenKey, rootId = null } = options;
  const map = new Map<any, ArrayToTreeResult<T, ChildrenKey>>();

  // 初始化所有节点的map
  arr.forEach((item) => map.set(item[idKey], { ...item, [childrenKey]: [] } as any));

  const tree: any = [];

  arr.forEach((item) => {
    const id = item[idKey];
    const parentId = item[pidKey];

    // 如果 parentId 是 null 或匹配 rootId，意味着这是一个根节点
    if (parentId === rootId) {
      tree.push(map.get(id));
    } else {
      const parent = map.get(parentId);
      if (parent) {
        parent[childrenKey].push(map.get(id) as ArrayToTreeResult<T, ChildrenKey>);
      }
    }
  });

  return tree;
}

export type ArrayFlatTreeTransform<T, K = T> = (item: T, rawParent?: T, transformedParent?: K) => K;

function arrayFlatTree<T, K = T>(
  tree: T[],
  childrenKey: keyof T,
  transform: ArrayFlatTreeTransform<T, K> = (item: T) => item as unknown as K,
): K[] {
  const _flat = (tree: T[], parent?: T, transformedParent?: K): K[] => {
    return tree.reduce((acc, node) => {
      const transformedNode = transform(node, parent, transformedParent);
      return acc.concat(transformedNode, _flat((node[childrenKey] || []) as T[], node, transformedNode));
    }, [] as K[]);
  };
  return _flat(tree);
}

export { arrayChunk, arrayFlatTree, arrayGroupBy, arrayMapBy, arrayToTree };
