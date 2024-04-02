<template>
  <div class="table-container">
    <div v-if="!hideTop" class="flex flex-col gap-8">
      <div v-if="title" class="flex gap-4">
        <div class="title">{{ title }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex gap-3 items-center">
          <InputTextField v-if="showSearch" v-model="searchText" :placeholder="searchPlaceholder" debounce />
          <slot name="extra"></slot>
        </div>
        <slot name="button"></slot>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table" border="0">
        <thead>
          <tr class="table--row">
            <th class="table--th w-10">
              <div>#</div>
            </th>
            <th
              v-for="column in tableColumns"
              :key="column.key"
              :class="['table--th', `table--${column.headerAlignment}`]"
              :style="column.styles"
            >
              <div>{{ column.label }}</div>
            </th>
            <th v-if="showAction" class="table--th w-20">
              <div>操作</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedData.length">
            <tr v-for="(item, index) in paginatedData" :key="item" class="table--row">
              <td class="table--td">
                <div>{{ index + 1 }}</div>
              </td>
              <td
                v-for="column in tableColumns"
                :key="column.key"
                :class="['table--td', `table--${column.contentAlignment}`]"
                :style="column.styles"
              >
                <div>
                  <slot :name="column.key" :item="item" :value="item[column.key]">
                    <HighlightSearchText
                      :text="item[column.key]"
                      :search-text="searchText"
                      :default-text="contentDefaultText"
                      :disabled="!column.search"
                      :ignorecase="searchConfig.ignoreCase"
                    ></HighlightSearchText>
                  </slot>
                </div>
              </td>
              <td v-if="showAction" class="table--td">
                <div class="flex justify-center gap-3">
                  <slot name="action" :item="item">
                    <!-- <SvgItem type="edit" class="text-blue-500"></SvgItem> -->
                    <!-- <SvgItem type="delete" class="text-red-500"></SvgItem> -->
                  </slot>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="table--row">
              <td class="table--td" :colspan="tableColumns.length + 2">
                <slot name="no-data">{{ noDataText }}</slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="!hideFooter" :class="['bg-white flex gap-2 justify-between items-center', footerClass]">
      <div>目前顯示{{ startIndex + 1 }}-{{ stopIndex }}條，共{{ pageCount }}頁</div>
      <div class="flex gap-1 items-center">
        <template v-for="i in pageCount" :key="i">
          <div :class="['change-page-btn', { 'is-active': i === page }]" @click="setPage(i)">
            {{ i }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useSearchFilter, UseSearchFilterConfig } from "@/composables/useSearchFilter";
import { createPagination, usePagination, usePaginatedItems } from "@/composables/usePagination";
import type { ColumnOptions, ColumnItem, TableColumnAlignment } from "./types";

interface Props {
  columns: ColumnItem[];
  columnAlignment?: TableColumnAlignment;
  dataSource: any[];
  title?: string;
  contentDefaultText?: string;

  // search
  showSearch?: boolean;
  searchText?: string;
  searchPlaceholder?: string;
  searchConfig?: UseSearchFilterConfig;

  showAction?: boolean;

  hideTop?: boolean;
  hideFooter?: boolean;
  footerClass?: string;

  noDataText?: string;
}
const props = withDefaults(defineProps<Props>(), {
  columnAlignment: "start",
  showAction: true,
  searchText: undefined,
  searchConfig: () => ({ ignoreCase: true }),
  showSearch: true,
  searchPlaceholder: "搜尋...",
  contentDefaultText: "-",
  title: "",
  hideTop: false,
  hideFooter: false,
  footerClass: "",
  noDataText: "No data",
});

const { columns, dataSource: _dataSource } = toRefs(props);

function handleColumn(column: ColumnOptions) {
  const _alignment = column.alignment ?? props.columnAlignment;
  return {
    alignment: _alignment,
    headerAlignment: _alignment,
    contentAlignment: _alignment,
    search: false,
    ...column,
    styles: {
      width: column.width,
      ...column.styles,
    },
  };
}
//欄位
const tableColumns = computed(() => {
  return columns.value.map((column) => {
    return typeof column === "string" || typeof column === "number" || typeof column === "symbol"
      ? ({
          key: column,
        } as ColumnOptions)
      : handleColumn(column);
  });
});

//搜尋的key
const searchKeys = computed(() => tableColumns.value.filter((i) => i.search).map((i) => i.key as string));

const _searchText = ref("");
const searchText = computed({
  get() {
    return props.searchText ?? _searchText.value;
  },
  set(v) {
    _searchText.value = v;
  },
});

const dataSourceSearched = computed(() => {
  if (searchKeys.value.length && searchText.value) {
    return useSearchFilter(_dataSource.value, searchText.value, searchKeys.value, props.searchConfig);
  } else return _dataSource.value;
});

const { page, itemsPerPage, itemsLength } = createPagination({ itemsLength: dataSourceSearched.value.length });
const { startIndex, stopIndex, setPage, setItemsPerPage, nextPage, prevPage, pageCount } = usePagination({
  page,
  itemsLength,
  itemsPerPage,
});
const { paginatedItems: paginatedData } = usePaginatedItems({
  items: dataSourceSearched,
  itemsPerPage,
  startIndex,
  stopIndex,
});
</script>

<style lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  .table-wrapper {
    max-width: 100%;
    overflow-x: auto;
    .table {
      --table-border: #ebeef5;
      width: 100%;
      border-spacing: 0px;
      border-collapse: collapse;

      @mixin table-alignment() {
        &.table--start {
          text-align: left;
        }
        &.table--center {
          text-align: center;
        }
        &.table--end {
          text-align: right;
        }
      }

      .table--row {
        .table--th {
          background-color: #e0e0e04d;
          color: #828282;
          padding: 1rem 0;
          white-space: nowrap;
        }
        .table--td {
          background-color: #fff;
          padding: 0.75rem 0;
        }
        .table--td,
        .table--th {
          @include table-alignment();
          &:first-child {
            text-align: center;
          }
          //用border會有一粗一細的問題
          // border-bottom: 1px solid #e0e0e0;
          box-shadow: inset 0px -1px 0px #e0e0e0;
          > div {
            padding: 0 0.75rem;
          }
        }

        &:hover {
          .table--td {
            @apply bg-slate-50;
            // background-color: rgb(203, 213, 225);
          }
        }
      }
    }
  }

  .change-page-btn {
    // w-10 h-10 flex justify-center items-center duration-400
    // hover:(bg-blue-500 text-white font-bold cursor-pointer)
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    color: #828282;
    &:hover,
    &.is-active {
      background-color: rgba(59, 130, 246, 1);
      font-weight: bold;
      color: white;
      cursor: pointer;
    }
  }

  .title {
    font-size: 1.5rem;
    line-height: 28px;
    font-weight: bold;
    color: #1e212c;
  }
}
</style>
