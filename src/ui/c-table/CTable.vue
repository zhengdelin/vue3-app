<template>
  <div class="table-container">
    <slot name="header">
      <div v-if="!hideHeader" :class="['flex items-center', headerClass]" :style="headerStyles">
        <div v-if="title" class="title">
          {{ title }}
        </div>
        <div :class="['title-extra', titleExtraClass]" :style="titleExtraStyles">
          <slot name="title-extra" v-bind="searchTextSlotProps">
            <slot name="search" v-bind="searchTextSlotProps">
              <c-text-field
                v-if="showSearch"
                v-model="searchText"
                :placeholder="searchPlaceholder"
                debounce
                hide-details
              />
            </slot>
            <slot name="title-buttons"></slot>
          </slot>
        </div>
      </div>
    </slot>
    <div class="table-wrapper">
      <table class="table" border="0">
        <thead>
          <tr class="table--row">
            <!-- select col -->
            <th v-if="selectable" class="table--th table--select">
              <div><c-checkbox select-all></c-checkbox></div>
            </th>
            <!-- index col -->
            <th v-if="!hideIndex" class="table--th table--index">
              <div>#</div>
            </th>
            <!-- columns -->
            <th
              v-for="column in tableColumns"
              :key="column.key"
              :class="['table--th', `table--align-${column.headerAlignment}`]"
              :style="column.styles"
            >
              <div>{{ column.label }}</div>
            </th>
            <!-- action col -->
            <th v-if="showAction" class="table--th w-20">
              <div>操作</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedData.length">
            <tr v-for="(item, index) in paginatedData" :key="item" class="table--row">
              <!-- select col -->
              <td v-if="selectable" class="table--td table--select">
                <div><c-checkbox :value="item"></c-checkbox></div>
              </td>
              <!-- index col -->
              <td v-if="!hideIndex" class="table--td table--index">
                <div>{{ index + 1 }}</div>
              </td>
              <!-- columns -->
              <td
                v-for="column in tableColumns"
                :key="column.key"
                :class="['table--td', `table--align-${column.contentAlignment}`]"
                :style="column.styles"
              >
                <div>
                  <slot :name="'item-' + column.key" :item="item" :value="item[column.key]">
                    <c-highlight-search-text
                      :text="item[column.key]"
                      :search-text="searchText"
                      :default-text="contentDefaultText"
                      :disabled="!column.search"
                      :ignorecase="searchConfig.ignoreCase"
                    ></c-highlight-search-text>
                  </slot>
                </div>
              </td>
              <!-- action col -->
              <td v-if="showAction" class="table--td">
                <div class="flex justify-center gap-3">
                  <slot name="action" :item="item">
                    <!--  -->
                  </slot>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="table--row">
              <td class="table--td table--align-center" :colspan="tableColumns.length + 2">
                <slot name="no-data">
                  {{ noDataText }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <slot name="footer" :start-index="startIndex" :stop-index="stopIndex" :page-count="pageCount" :set-page="setPage">
      <div
        v-if="!hideFooter"
        :class="['bg-white flex gap-2 justify-between items-center', footerClass]"
        :style="footerStyles"
      >
        <div>目前顯示{{ startIndex + 1 }}-{{ stopIndex }}條，共{{ pageCount }}頁</div>
        <div class="flex gap-1 items-center">
          <template v-for="i in pageCount" :key="i">
            <div :class="['change-page-btn', { 'is-active': i === page }]" @click="setPage(i)">
              {{ i }}
            </div>
          </template>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { createPagination, usePaginatedItems, usePagination } from "@/composable/usePagination";
import { useSearchFilter, UseSearchFilterConfig } from "@/composable/useSearchFilter";
import { useVModel } from "@/composable/useVModel";
import { computed, ref, toRefs } from "vue";
import { provideCheckboxGroup } from "../c-checkbox-group/useCheckboxGroup";
import type { ColumnItem, ColumnOptions, TableColumnAlignment } from "./types";

interface Props {
  // data
  dataSource: any[];
  columns: ColumnItem[];
  columnAlignment?: TableColumnAlignment;
  contentDefaultText?: string;

  // title
  title?: string;
  titleExtraClass?: string;
  titleExtraStyles?: Record<string, any>;

  // search
  showSearch?: boolean;
  searchText?: string;
  searchPlaceholder?: string;
  searchConfig?: UseSearchFilterConfig;

  // show
  hideIndex?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;

  headerClass?: string;
  headerStyles?: Record<string, any>;
  footerStyles?: Record<string, any>;
  footerClass?: string;

  itemsPerPage?: number;

  noDataText?: string;

  // select
  selectable?: boolean;
  selectedItems?: any[];
}
const props = withDefaults(defineProps<Props>(), {
  // data
  columnAlignment: "start",
  contentDefaultText: "-",

  // title
  title: "",
  titleExtraClass: "",
  titleExtraStyles: undefined,

  // search
  showSearch: false,
  searchText: undefined,
  searchPlaceholder: "搜尋...",
  searchConfig: () => ({ ignoreCase: true }),

  // show
  hideIndex: false,
  hideHeader: false,
  hideFooter: false,

  headerClass: "",
  headerStyles: undefined,
  footerStyles: undefined,
  footerClass: "",

  itemsPerPage: 10,

  noDataText: "No data",

  // select
  selectable: false,
  selectedItems: undefined,
});
const emit = defineEmits(["update:selectedItems"]);
const slots = useSlots();

const { columns, dataSource: _dataSource } = toRefs(props);

const showAction = computed(() => !!slots["action"]);
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

//搜尋
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
const searchTextSlotProps = computed(() => ({
  searchText: searchText.value,
  updateSearchText: (text: string) => (searchText.value = text),
  searchPlaceholder: props.searchPlaceholder,
}));

const dataSourceSearched = computed(() => {
  const value = _dataSource.value || [];
  if (searchKeys.value.length && searchText.value) {
    return useSearchFilter(value, searchText.value, searchKeys.value, props.searchConfig);
  } else return value;
});

// 分頁
const { page, itemsPerPage } = createPagination({
  ...props,
});
const { startIndex, stopIndex, setPage, pageCount } = usePagination({
  page,
  itemsLength: computed(() => dataSourceSearched.value.length),
  itemsPerPage,
});
const { paginatedItems: paginatedData } = usePaginatedItems({
  items: dataSourceSearched,
  itemsPerPage,
  startIndex,
  stopIndex,
});

// select
const selectedItems = useVModel({
  props,
  propName: "selectedItems",
  emit,
});
if (props.selectable) {
  provideCheckboxGroup({
    modelValue: selectedItems,
    readonly: computed(() => false),
    disabled: computed(() => false),
  });
}
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
        &.table--align-start {
          text-align: left;
        }
        &.table--align-center {
          text-align: center;
        }
        &.table--align-end {
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

          //用border會有一粗一細的問題
          // border-bottom: 1px solid #e0e0e0;
          box-shadow: inset 0px -1px 0px #e0e0e0;
          > div {
            padding: 0 0.75rem;
          }
        }

        &:hover {
          .table--td {
            background-color: rgb(245, 254, 255);
          }
        }

        .table--select {
          width: 56px;
          > div {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .table--index {
          width: 40px;
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
    margin-right: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .title-extra {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
}
</style>
