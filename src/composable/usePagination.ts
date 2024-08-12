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

type PaginationShowStrategyItem =
  | {
      value: number;
      display: "number";
    }
  | {
      value: typeof ELLIPSIS;
      display: "ellipsis";
    };
interface PaginationShowStrategy {
  totalShowCount: number;
  showStart?: boolean;
  showLast?: boolean;
}
const ELLIPSIS = "...";
export function usePaginationShowStrategy(options: {
  page: Ref<number>;
  pageCount: Ref<number>;
  strategy?: Ref<PaginationShowStrategy>;
}) {
  const { page, pageCount, strategy = ref({ totalShowCount: 5, showStart: true, showLast: true }) } = options;
  strategy.value.showLast ??= true;
  strategy.value.showStart ??= true;

  const strategyShowCount = computed(() => {
    const { totalShowCount } = strategy.value;
    const half = Math.floor(totalShowCount / 2);
    const showCount =
      totalShowCount % 2 === 0
        ? {
            before: half - 1,
            after: half,
          }
        : {
            before: half,
            after: half,
          };

    if (page.value <= showCount.before) {
      const offset = showCount.before - page.value + 1;

      showCount.before -= offset;
      showCount.after += offset;
    } else if (page.value + showCount.after > pageCount.value) {
      const offset = page.value + showCount.after - pageCount.value;
      showCount.after -= offset;
      showCount.before += offset;
    }

    console.log("showCount :>> ", showCount);
    return showCount;
  });

  const showItemsBeforeCurPage = computed(() => {
    if (pageCount.value < 2 || page.value === 1) return [];
    const shows = [] as PaginationShowStrategyItem[];

    if (strategy.value.showStart) {
      shows.push({
        value: 1,
        display: "number",
      });
    }

    const firstIndex = Math.max(page.value - strategyShowCount.value.before, 2);
    const lastIndex = page.value - 1;

    if (firstIndex > 2) {
      shows.push({
        value: ELLIPSIS,
        display: "ellipsis",
      });
    }

    for (let i = firstIndex; i <= lastIndex; i++) {
      shows.push({
        value: i,
        display: "number",
      });
    }

    return shows;
  });
  const showItemsAfterCurPage = computed(() => {
    if (pageCount.value < 2 || page.value === pageCount.value) return [];

    const shows = [] as PaginationShowStrategyItem[];

    let alreadyAddIdx = 0;
    for (let i = 0; i < strategyShowCount.value.after; i++) {
      alreadyAddIdx = i + page.value + 1;
      shows.push({
        value: alreadyAddIdx,
        display: "number",
      });
      if (alreadyAddIdx >= pageCount.value) return shows;
    }

    // page總數與當前已添加節點的idx的距離超過1
    if (pageCount.value - alreadyAddIdx > 1) {
      shows.push({
        value: ELLIPSIS,
        display: "ellipsis",
      });
    }

    if (strategy.value.showLast) {
      shows.push({
        value: pageCount.value,
        display: "number",
      });
    }

    return shows;
  });
  const paginationShowItems = computed(() => {
    console.log("showItemsBeforeCurPage.value :>> ", showItemsBeforeCurPage.value);
    console.log("showItemsAfterCurPage.value :>> ", showItemsAfterCurPage.value);
    return [
      ...showItemsBeforeCurPage.value,
      { value: page.value, display: "number" } as PaginationShowStrategyItem,
      ...showItemsAfterCurPage.value,
    ];
  });

  return { paginationShowItems };
}
