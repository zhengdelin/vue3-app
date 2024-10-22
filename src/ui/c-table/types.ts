import type { VNodeChild } from "vue";

// base
export type KeyType<T> = (keyof T & string) | (string & Record<never, never>);
export type TableColumnAlignment = "start" | "end" | "center";
export type TableColumnType = "default" | "index" | "expand";

// column type
interface TableColumnBase<T = any> {
  key: KeyType<T>;
  label?: string;
  value?: (data: { rowData: T; rowIndex: number }) => any;
  render?: (data: { rowData: T; rowIndex: number }) => VNodeChild;
}
interface TableColumnAlignments {
  alignment?: TableColumnAlignment;
  headerAlignment?: TableColumnAlignment;
  contentAlignment?: TableColumnAlignment;
}
interface TableColumnStyles {
  class?: string;
  headerClass?: string;
  styles?: Record<string, any>;
  headerStyles?: Record<string, any>;
  width?: string;
}

export interface TableColumnExpand<T = any> extends TableColumnBase<T> {
  type: "expand";
}

export interface TableColumnIndex<T = any>
  extends Omit<TableColumnBase<T>, "key">,
    TableColumnAlignments,
    TableColumnStyles {
  type: "index";
  key?: KeyType<T>;
}
export interface TableColumnActions<T = any>
  extends Omit<TableColumnBase<T>, "key">,
    TableColumnAlignments,
    TableColumnStyles {
  type: "actions";
  key?: KeyType<T>;
}

export interface TableColumnDefault<T = any> extends TableColumnBase<T>, TableColumnAlignments, TableColumnStyles {
  type?: "default" | "index";
}

export type TableColumn<T = any> =
  | TableColumnExpand<T>
  | TableColumnDefault<T>
  | TableColumnIndex<T>
  | TableColumnActions<T>;
export type TableColumns<T = any> = TableColumn<T>[];

export interface TableProps<T = any> {
  data: T[];
  dataKey?: keyof T | ((item: T) => any);
  columns: TableColumns<T>;
  alignment?: TableColumnAlignment;

  /**
   * table layout: fixed
   */
  fixed?: boolean;
}
