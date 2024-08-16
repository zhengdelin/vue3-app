<template>
  <div class="c-tabs">
    <div
      class="no-scrollbar"
      :class="[
        'c-tabs--header',
        { 'is-sticky': sticky, 'sticky-to-header': sticky && stickyToHeader, 'is-grow': grow },
      ]"
    >
      <slot :items="items">
        <c-tabs-item
          v-for="item in items"
          :key="item[itemValueKey]"
          :value="item[itemValueKey]"
          :title="item[itemTitleKey]"
          :route="item.route"
        ></c-tabs-item>
      </slot>
    </div>
    <div v-if="isAnyPageSlotPassed" :class="['c-tabs--content', contentClass]">
      <slot name="pages" :active-tab="modelV" :items="items">
        <template v-for="tab in items" :key="tab[itemValueKey]">
          <div
            v-if="isFirstRendered(tab) ? keepalive || isPageActive(tab) : false"
            v-show="isPageActive(tab)"
            class="tab-page"
            :data-id="tab[itemValueKey]"
            :class="pageClass"
          >
            <Suspense :timeout="0">
              <template #fallback>
                <slot name="loading">
                  <div class="relative">
                    <!-- <Loading /> -->
                  </div>
                </slot>
              </template>
              <slot :name="getTabSlotName(tab)" :active-tab="modelV"></slot>
            </Suspense>
          </div>
        </template>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import useRouteCompare from "@/composable/useRouteCompare";
import { useVModel } from "@/composable/useVModel";
import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from "vue-router";
import type { Tab as DefaultTabT } from "../c-tabs-item/c-tabs-item.types";
type Tab = DefaultTabT & { [key: string]: any };
const props = withDefaults(
  defineProps<{
    modelValue?: any;
    items?: Tab[];
    /**
     * @default value
     */
    itemValueKey?: string;
    /**
     * @default title
     */
    itemTitleKey?: string;
    /**
     * 預設active的tab，當modelValue有傳值時將會無效
     * @default default 預設取items的第一個的value，否則為default
     */
    defaultItem?: string;

    onBeforeTabChange?: Tab["onBeforeTabChange"];

    /**
     * @default false
     */
    sticky?: boolean;
    /**
     * sticky為true時才生效
     * @default true
     */
    stickyToHeader?: boolean;

    /**
     * 開啟路由選項
     * @default false
     */
    router?: boolean;
    /**
     * 設置全部路由的replace
     */
    routeReplace?: boolean;
    /**
     * @default tab
     */
    routerQueryKey?: string;

    /**
     * @default false
     */
    keepalive?: boolean;
    /**
     * @default true
     */
    lazy?: boolean;
    /**
     * 每個標籤頁是否自動撐滿空間
     * @default false
     */
    grow?: boolean;

    contentClass?: string;
    pageClass?: string;
  }>(),
  {
    items: () => [],
    itemValueKey: "value",
    itemTitleKey: "title",
    type: "default",
    modelValue: undefined,
    router: false,
    routeReplace: false,
    routerQueryKey: "tab",
    sticky: false,
    stickyToHeader: true,
    keepalive: false,
    lazy: true,

    contentClass: "",
    pageClass: "",
  },
);
const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();

const isRouter = computed(() => props.router);
const itemValueKey = computed(() => props.itemValueKey);

/** 包含route的items */
const items = computed<Tab[]>(() => {
  if (!isRouter.value) {
    return props.items;
  }

  return props.items.map((item) => {
    const value = item[itemValueKey.value];
    return {
      route(curRoute: RouteLocationNormalizedLoaded) {
        return {
          query: Object.assign({}, curRoute.query, { [props.routerQueryKey]: value }),
          replace: props.routeReplace,
        } as RouteLocationRaw;
      },
      ...item,
    };
  });
});

const lazy = computed(() => props.lazy);

const getTabSlotName = (tab: Tab) => `page-${tab[itemValueKey.value]}`;

const isPageSlotPassed = (tab: Tab) => !!slots[getTabSlotName(tab)];
const isAnyPageSlotPassed = computed(() => !!(slots.pages || props.items?.some((tab) => isPageSlotPassed(tab))));

// const { modelV } = (() => {
//   if (props.modelValue !== undefined) {
//     return {
//       modelV: useVModel({
//         props,
//         emit,
//         setter(v) {
//           emit("update:modelValue", v);
//           // changeTabRoute(v);
//         },
//       }),
//     };
//   }
//   const defaultItem = props.defaultItem ?? props.items?.[0]?.[itemValueKey.value] ?? "default";
//   return {
//     modelV: ref(defaultItem),
//   };
// })();

const modelV = useVModel({
  props,
  emit,
  transformIn(value) {
    if (value !== undefined) return value;
    return props.defaultItem ?? props.items?.[0]?.[itemValueKey.value] ?? "default";
  },
});

provide("modelValue", modelV);

// /**
//  * 一開始同步路由與modelValue
//  */
(() => {
  const { compare, router } = useRouteCompare();
  const curRoute = router.currentRoute.value;
  for (const item of items.value) {
    if (!item.route) continue;

    const tabRoute = typeof item.route === "function" ? item.route(curRoute) : item.route;

    if (compare(tabRoute)) {
      modelV.value = item[itemValueKey.value];
    }
  }
})();
provide("defaults", {
  onBeforeTabChange: props.onBeforeTabChange,
});

const isPageActive = (tab: Tab) => modelV.value === tab[itemValueKey.value];
const firstRendered = ref(
  props.items?.reduce((prev, tab) => {
    const v = tab[itemValueKey.value];
    prev[v] = !lazy.value || modelV.value === v;
    return prev;
  }, {} as Record<string, boolean>),
);
const isAllFirstRendered = computed(() =>
  firstRendered.value ? Object.values(firstRendered.value).every(Boolean) : false,
);
const isFirstRendered = (tab: Tab) => firstRendered.value?.[tab[itemValueKey.value]];

if (!isAllFirstRendered.value) {
  const unwatch = watchEffect(() => {
    if (firstRendered.value) {
      firstRendered.value[modelV.value] = true;
    }
    if (isAllFirstRendered.value) {
      unwatch();
    }
  });
}
</script>
<style lang="scss">
.c-tabs {
  --border-width: 1px;
  --border-color: rgb(247, 247, 247);
  --border: var(--border-width) solid var(--border-color);

  --tab-header-bg-color: white;
  --tab-height: 46px;

  @apply flex flex-col;

  &--header {
    flex: none;
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    background: var(--tab-header-bg-color);
    overflow: auto hidden;
    border-bottom: var(--border);

    &.is-sticky {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 2;

      &.sticky-to-header {
        top: var(--header-height);
      }
    }

    &.is-grow .tab-item {
      flex: 1;
    }
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
