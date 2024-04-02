interface CompareFun {
  (text: unknown): boolean;
}

interface UseSearchFilterHandler<T> {
  (item: T, index: number, compareFun: CompareFun, searchText: string): boolean;
}

export interface UseSearchFilterConfig {
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
//   filterHandler: UseSearchFilterHandler<T>;
// }

/**
 * 傳入一個key值 篩選出有包含在搜尋字串中的陣列
 * @param data
 * @param searchText
 * @param key
 * @param config
 */
function useSearchFilter<T, U extends keyof T>(
  data: T[],
  searchText: string,
  key: U,
  config?: UseSearchFilterConfig,
): T[];

/**
 * 傳入一個函數 篩選出目標陣列
 * @param data
 * @param searchText
 * @param config
 */
function useSearchFilter<T>(
  data: T[],
  searchText: string,
  filterHandler: UseSearchFilterHandler<T>,
  config?: UseSearchFilterConfig,
): T[];

/**
 * 傳入一個包含key值或搜尋函數的陣列 篩選出有包含在搜尋字串中的陣列
 * @param data
 * @param searchText
 * @param keys
 * @param config
 */
function useSearchFilter<T, U extends keyof T>(
  data: T[],
  searchText: string,
  keys: Array<U | UseSearchFilterHandler<T>>,
  config?: UseSearchFilterConfig,
): T[];

/**
 * Filters an array of data based on a search text and specified keys or handler function.
 *
 * @param {T[]} data - The array of data to be filtered.
 * @param {string} searchText - The text to search for.
 * @param {U | Array<U | UseSearchFilterHandler<T>> | UseSearchFilterHandler<T>} keysOrHandler - The keys or handler function to filter the data.
 * @param {UseSearchFilterConfig} [config] - The configuration object for the filter.
 * @param {boolean} [config.strict] - Determines if the filter should use strict mode.
 * @param {boolean} [config.ignoreCase] - Determines if the filter should ignore case.
 * @return {T[]} The filtered array of data.
 */
function useSearchFilter<T, U extends keyof T>(
  data: T[],
  searchText: string,
  keysOrHandler: U | Array<U | UseSearchFilterHandler<T>> | UseSearchFilterHandler<T>,
  config: UseSearchFilterConfig = {
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

  if (typeof keysOrHandler === "function")
    return data.filter((item, index) => keysOrHandler(item, index, compareFun, searchText));
  if (Array.isArray(keysOrHandler)) {
    const filterFunc = keysOrHandler[strict ? "every" : "some"].bind(keysOrHandler);
    return data.filter((item) =>
      // strictMode使用every，表示需要每項都符合
      filterFunc((keyOrHandler, index) =>
        typeof keyOrHandler === "function"
          ? keyOrHandler(item, index, compareFun, searchText)
          : compareFun(item[keyOrHandler]),
      ),
    );
  }
  return data.filter((item) => compareFun(item[keysOrHandler]));
}

export { useSearchFilter };
