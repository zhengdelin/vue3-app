<script setup lang="ts">
import { usePagination, usePaginationShowStrategy } from "@/composable/usePagination";

const props = withDefaults(
  defineProps<{
    totalCount: number;
  }>(),
  {},
);

const page = defineModel<number>("page", { default: 1 });

const itemsPerPage = defineModel<number>("itemsPerPage", { default: 10 });
const itemsLength = computed(() => props.totalCount);
const { startIndex, stopIndex, pageCount, setPage } = usePagination({ page, itemsPerPage, itemsLength });
const { paginationShowItems } = usePaginationShowStrategy({ page, pageCount });
</script>
<template>
  <div class="w-full flex gap-2 justify-between items-center">
    <div>目前顯示{{ startIndex + 1 }}-{{ stopIndex }}條，共{{ pageCount }}頁</div>
    <div class="flex gap-1 items-center">
      <template v-for="(i, idx) in paginationShowItems" :key="idx">
        <div
          v-if="i.display === 'number'"
          :class="['change-page-btn', { 'is-active': i.value === page }]"
          @click="setPage(i.value)"
        >
          {{ i.value }}
        </div>
        <div v-else class="change-page-btn is-disabled">
          {{ i.value }}
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.change-page-btn {
  // w-10 h-10 flex justify-center items-center duration-400
  // hover:(bg-blue-500 text-white font-bold cursor-pointer)
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  // transition: all 0.3s ease;
  color: #828282;
  user-select: none;
  &:hover,
  &.is-active {
    background-color: rgba(59, 130, 246, 1);
    font-weight: bold;
    color: white;
    cursor: pointer;
  }

  &.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
