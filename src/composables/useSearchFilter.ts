interface CompareFun {
  (text: unknown): boolean;
}

interface FilterHandler<T> {
  (item: T, index: number, compareFun: CompareFun, searchText: string): boolean;
}

interface FilterConfig {
  /**
   *  嚴格搜尋
   * @default false 表示目標字段中任意一個符合及符合要求
   */
  strict?: boolean;
  /**
   * 忽略大小寫
   * @default true
   */
  ignoreCase?: boolean;
}

// interface SearchFilterParams<T> {
//   data: T[];
//   text: string;
//   filterHandler: FilterHandler<T>;
// }

/**
 * 傳入一個key值 篩選出有包含在搜尋字串中的陣列
 * @param data
 * @param searchText
 * @param key
 * @param config
 */
function useSearchFilter<T, U extends keyof T>(data: T[], searchText: string, key: U, config?: FilterConfig): T[];

/**
 * 傳入一個函數 篩選出目標陣列
 * @param data
 * @param searchText
 * @param config
 */
function useSearchFilter<T>(data: T[], searchText: string, filterHandler: FilterHandler<T>, config?: FilterConfig): T[];

/**
 * 傳入一個包含key值或搜尋函數的陣列 篩選出有包含在搜尋字串中的陣列
 * @param data
 * @param searchText
 * @param keys
 * @param config
 */
function useSearchFilter<T, U extends keyof T>(data: T[], searchText: string, keys: Array<U | FilterHandler<T>>, config?: FilterConfig): T[];

function useSearchFilter<T, U extends keyof T>(
  data: T[],
  searchText: string,
  keysOrHandler: U | Array<U | FilterHandler<T>> | FilterHandler<T>,
  config: FilterConfig = {
    strict: false,
    ignoreCase: true,
  },
) {
  const { strict = false, ignoreCase = true } = config;
  const compareFun: CompareFun = ignoreCase
    ? (text) => !!text?.toString().toLowerCase().includes(searchText.toLowerCase())
    : (text) => !!text?.toString().includes(searchText);

  // 沒有搜尋直接返回原陣列
  if (!searchText) return data;

  if (typeof keysOrHandler === "function") return data.filter((item, index) => keysOrHandler(item, index, compareFun, searchText));
  if (Array.isArray(keysOrHandler)) {
    return data.filter((item) =>
      // strictMode使用every，表示需要每項都符合
      keysOrHandler[strict ? "every" : "some"]((keyOrHandler, index) =>
        typeof keyOrHandler === "function" ? keyOrHandler(item, index, compareFun, searchText) : compareFun(item[keyOrHandler]),
      ),
    );
  }
  return data.filter((item) => compareFun(item[keysOrHandler]));
}

export { useSearchFilter };
