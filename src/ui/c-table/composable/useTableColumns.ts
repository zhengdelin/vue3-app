import { ColumnOptions } from "../types";

function useTableColumns<T>(data: Maybe<T[]>, columns: ColumnOptions<T>): ColumnOptions<T>;
function useTableColumns<T = any>(columns: ColumnOptions<T>): ColumnOptions<T>;

function useTableColumns<T = any>(dataOrColumns: Maybe<T[]> | ColumnOptions<T>, columns?: ColumnOptions<T>) {
  if (columns) {
    return columns;
  }

  return dataOrColumns as ColumnOptions<T>;
}

export default useTableColumns;
