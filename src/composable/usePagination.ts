// import { WatchSource, ToRefs, isRef } from "vue";
// import { PaginationQuery, PaginationParams } from "./../types";
import { useVModel } from "@/composable/useVModel";
import { clamp } from "@/utils/helpers";
interface PaginateProps {
  itemsLength?: number;
  page?: number;
  itemsPerPage?: number;
}

export function createPagination(props: PaginateProps) {
  const page = useVModel({
    props,
    propName: "page",
    transformIn(value) {
      return value ?? 1;
    },
  });
  const itemsPerPage = useVModel({
    props,
    propName: "itemsPerPage",
    transformIn(value) {
      return value ?? 10;
    },
  });
  const itemsLength = computed(() => props.itemsLength || 0);
  return {
    page,
    itemsPerPage,
    itemsLength,
  };
}

export function usePagination(options: { page: Ref<number>; itemsPerPage: Ref<number>; itemsLength: Ref<number> }) {
  const { page, itemsPerPage, itemsLength } = options;

  const pageCount = computed(() => {
    if (itemsPerPage.value === -1 || itemsLength.value === 0) return 1;
    return Math.ceil(itemsLength.value / itemsPerPage.value);
  });

  watchEffect(() => {
    if (page.value > pageCount.value) {
      page.value = pageCount.value;
    }
  });

  const startIndex = computed(() => {
    if (itemsPerPage.value === -1) return 0;
    return (page.value - 1) * itemsPerPage.value;
  });
  const stopIndex = computed(() => {
    if (itemsPerPage.value === -1) return itemsLength.value;

    // 不超過總長度
    return Math.min(startIndex.value + itemsPerPage.value, itemsLength.value);
  });

  function setItemsPerPage(value: number) {
    itemsPerPage.value = value;
    page.value = 1;
  }

  function setPage(value: number) {
    page.value = clamp(value, 1, pageCount.value);
  }

  function nextPage() {
    setPage(page.value + 1);
  }

  function prevPage() {
    setPage(page.value - 1);
  }

  return {
    pageCount,
    startIndex,
    stopIndex,
    setItemsPerPage,
    setPage,
    nextPage,
    prevPage,
  };
}

export function usePaginatedItems<T>(options: {
  itemsPerPage: Ref<number>;
  items: Ref<T[]>;
  startIndex: Ref<number>;
  stopIndex: Ref<number>;
}) {
  const { items, itemsPerPage, startIndex, stopIndex } = options;

  const paginatedItems = computed(() => {
    if (itemsPerPage.value <= 0) return items.value;
    return items.value.slice(startIndex.value, stopIndex.value);
  });

  return { paginatedItems };
}
