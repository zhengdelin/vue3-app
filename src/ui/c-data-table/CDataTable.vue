<script setup lang="ts" generic="T extends object = any">
import { usePaginatedItems, usePagination } from "@/composable/usePagination";
import CPagination from "../c-pagination/CPagination.vue";
import CTable from "../c-table/CTable.vue";
import type { DataTableProps } from "./types";
const props = defineProps<DataTableProps<T>>();

const items = computed(() => props.data);
const itemsLength = computed(() => props.data.length);

// pagination
const page = defineModel<number>("page", { default: 1 });
const itemsPerPage = defineModel<number>("itemsPerPage", { default: 10 });
const { startIndex, stopIndex, pageCount } = usePagination({ page, itemsPerPage: itemsPerPage, itemsLength });
const { paginatedItems } = usePaginatedItems({ items, itemsPerPage, startIndex, stopIndex });
// slots
const dataTableSlotProps = computed(() => ({
  paginatedItems: paginatedItems.value,
  pageCount: pageCount.value,
  page: page.value,
  updatePage: (value: number) => (page.value = value),
  itemsPerPage: itemsPerPage.value,
  updateItemsPerPage: (value: number) => (itemsPerPage.value = value),
}));
</script>

<template>
  <div class="data-table-container">
    <slot name="table" v-bind="dataTableSlotProps">
      <CTable v-bind="props" :data="paginatedItems" :columns="columns || []">
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </CTable>
    </slot>
    <div class="pagination-container">
      <slot name="pagination" v-bind="dataTableSlotProps">
        <CPagination v-model:page="page" :total-count="itemsLength" />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
