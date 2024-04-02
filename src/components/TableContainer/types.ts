export type TableColumnAlignment = "start" | "end" | "center";
export interface ColumnOptions<T = any> {
  key: keyof T;
  label: string;
  /**
   * 是否可搜索
   * @default false
   */
  search?: boolean;

  width?: string;
  styles?: any;
  /**
   * 對齊方式
   */
  alignment?: TableColumnAlignment;
  /**
   * 標題對齊方式，其優先級高於對齊方式
   */
  headerAlignment?: TableColumnAlignment;
  /**
   * 內容對齊方式，其優先級高於對齊方式
   */
  contentAlignment?: TableColumnAlignment;

  /**
   * 是否可排序
   * @default false
   */
  sort?: boolean;
}
export type ColumnItem<T = any> = ColumnOptions<T> | keyof T;
