import { VNodeChild } from "vue";

export type TableColumnAlignment = "start" | "end" | "center";
export interface ColumnOption<T = any> {
  key: string;
  label?: string;
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

  render?: (data: { rowData: T; rowIndex: number; value: any }) => VNodeChild;
}
export type ColumnOptions<T = any> = ColumnOption<T>[];
