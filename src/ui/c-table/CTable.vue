<script setup lang="ts" generic="T extends object = any">
import type { TableColumn, TableColumnIndex, TableProps } from "./types";

const props = withDefaults(defineProps<TableProps<T>>(), {
  alignment: "center",
});
const data = computed(() => props.data);

const tableSlotProps = (item: T, idx: number) => ({ rowData: item, rowIndex: idx });

// columns
const INDEX_KEY = "index";
const INDEX_WIDTH = "50px";
const ACTIONS_KEY = "actions";
const columns = computed(() => props.columns.map((column) => mapColumn(column)));
function mapColumn(column: TableColumn<T>): Exclude<TableColumn<T>, TableColumnIndex<T>> {
  if (column.type === "expand") {
    return column;
  }
  if (column.type === "index") {
    column.key = INDEX_KEY;
    column.width ||= INDEX_WIDTH;
  }
  if (column.type === "actions") {
    column.key = ACTIONS_KEY;
  }
  const _alignment = column.alignment || props.alignment || "center";
  return {
    headerAlignment: column.headerAlignment ?? _alignment,
    contentAlignment: column.contentAlignment ?? _alignment,
    ...column,
    styles: {
      width: column.width,
      ...column.styles,
    },
    headerStyles: {
      width: column.width,
      ...column.headerStyles,
    },
  } as Exclude<TableColumn<T>, TableColumnIndex<T>>;
}
const isIndexColumn = (column: TableColumn<T>) => column.type === "index";
const isActionsColumn = (column: TableColumn<T>) => column.type === "actions";
const isDefined = (value: any) => value !== undefined && value !== null;
const getColumnValue = (item: T, idx: number, column: TableColumn<T>) => {
  if (typeof column.value === "function") {
    return column.value(tableSlotProps(item, idx));
  }
  if (!isDefined(item)) return "";
  return item[column.key as keyof T] ?? "";
};

/**
 * ts 抓不到 template 上的 key
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const getDataKey = computed(() => (typeof props.dataKey === "function" ? props.dataKey : () => props.dataKey || "id"));
</script>

<template>
  <div class="table-wrapper">
    <table class="table" :class="{ 'table--fixed': fixed }" border="0">
      <thead class="table__header">
        <slot name="header">
          <tr class="table__header-row">
            <template v-for="column in columns" :key="column.key">
              <th
                v-if="column.type !== 'expand'"
                class="table__header-cell"
                :class="[`table-align-${column.headerAlignment}`, column.headerClass]"
                :style="column.headerStyles"
              >
                <template v-if="column.type === 'actions'">
                  <slot :name="`${ACTIONS_KEY}-header`">
                    <div class="table__header-cell-text">
                      {{ column.label || "操作" }}
                    </div>
                  </slot>
                </template>
                <template v-else>
                  <slot :name="`item-${column.key}-header`">
                    <div class="table__header-cell-text">
                      {{ column.label }}
                    </div>
                  </slot>
                </template>
              </th>
            </template>
          </tr>
        </slot>
      </thead>
      <tbody class="table__body">
        <slot name="body">
          <template v-if="data?.length">
            <template v-for="(item, idx) in data" :key="getDataKey(item)">
              <slot name="row" v-bind="tableSlotProps(item, idx)">
                <tr class="table__row">
                  <template v-for="column in columns" :key="column.key">
                    <td
                      v-if="column.type !== 'expand'"
                      class="table__cell"
                      :style="column.styles"
                      :class="[`table-align-${column.contentAlignment}`, column.class]"
                    >
                      <slot :name="`item-${column.key}`" v-bind="tableSlotProps(item, idx)">
                        <component :is="column.render" v-if="column.render" v-bind="tableSlotProps(item, idx)" />
                        <div v-else-if="isIndexColumn(column)" class="table__cell-text">
                          {{ idx + 1 }}
                        </div>
                        <div v-else-if="isActionsColumn(column)" class="table__cell-text table__cell-actions">
                          <slot :name="ACTIONS_KEY" v-bind="tableSlotProps(item, idx)" />
                        </div>
                        <div v-else class="table__cell-text">
                          {{ getColumnValue(item, idx, column) }}
                        </div>
                      </slot>
                    </td>
                  </template>
                </tr>
              </slot>
            </template>
          </template>
          <template v-else>
            <tr class="table__row">
              <td colspan="100" class="table__cell table-align-center">
                <slot name="empty"> 沒有資料 </slot>
              </td>
            </tr>
          </template>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
$name: "table";
.#{$name} {
  --table-border: #ebeef5;
  --table-header-bg: #e0e0e04d;
  --table-header-color: #828282;
  --table-cell-bg: #fff;
  --table-hover-bg: rgb(245, 254, 255);
  --table-border-color: #e0e0e0;
  width: 100%;
  border-spacing: 0px;
  border-collapse: collapse;

  &--fixed {
    table-layout: fixed;
  }

  @mixin table-alignment() {
    &.table-align-start {
      text-align: left;
    }
    &.table-align-center {
      text-align: center;
    }
    &.table-align-end {
      text-align: right;
    }
  }

  &__header-cell {
    background-color: var(--table-header-bg);
    color: var(--table-header-color);
    white-space: nowrap;

    @include table-alignment();

    &-text {
      padding: 1rem 0.75rem;
    }
  }

  &__row {
    .#{$name}__cell {
      background-color: var(--table-cell-bg);

      &-text {
        padding: 0.75rem;
      }

      @include table-alignment();

      &-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
    }

    &:hover {
      .#{$name}__cell {
        background-color: var(--table-hover-bg);
      }
    }
  }

  &__header-cell,
  &__cell {
    //用border會有一粗一細的問題
    // border-bottom: 1px solid #e0e0e0;
    box-shadow: inset 0px -1px 0px var(--table-border-color);
  }
}
</style>
