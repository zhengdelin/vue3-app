import { TableProps } from "../c-table/types";

export type DataTableProps<T = any> = Omit<TableProps<T>, "columns"> & Partial<Pick<TableProps<T>, "columns">>;
