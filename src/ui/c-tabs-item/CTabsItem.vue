<template>
  <div :class="['c-tabs-item', { 'is-active': isActive }]" @click="onClick">
    <slot :is-active="isActive">
      <span>{{ title }}</span>
      <slot name="title-extra"></slot>
    </slot>
  </div>
</template>
<script setup lang="ts" generic="T = any">
import useRouteCompare from "@/composable/useRouteCompare";
import type { WritableComputedRef } from "vue";
import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from "vue-router";
import type { Tab, TabOnBeforeTabChangeNext } from "./c-tabs-item.types";

const props = defineProps<Tab<T>>();

const tabRoute = computed(() => {
  if (!props.route) return;
  return (curRoute: RouteLocationNormalizedLoaded) =>
    typeof props.route === "function" ? props.route(curRoute) : (props.route as RouteLocationRaw);
});

const { router, compare } = useRouteCompare();
const curRoute = computed(() => router.currentRoute.value);

const modelV = inject<WritableComputedRef<any>>(
  "modelValue",
  computed({
    get() {
      //
    },
    set() {
      //
    },
  }),
);
const isActive = computed(() => modelV.value === props.value);

const injections = inject("defaults", {
  onBeforeTabChange: (() => {
    //
  }) as Tab<T>["onBeforeTabChange"],
});
const onBeforeTabChange = computed(() => props.onBeforeTabChange ?? injections.onBeforeTabChange);

const setModelValue = (value = props.value) => (modelV.value = value);
async function onClick() {
  const next: TabOnBeforeTabChangeNext = (tab = props.value, route = tabRoute.value?.(curRoute.value)) => {
    setModelValue(tab as any);
    if (route) {
      router.push(route);
    }
  };
  if (typeof onBeforeTabChange.value === "function") {
    const needToChangeTab = await onBeforeTabChange.value(props.value as any, next);
    if (needToChangeTab !== true) {
      return;
    }
  }
  next();
}

if (props.route) {
  onBeforeRouteUpdate((to) => {
    if (tabRoute.value && compare(tabRoute.value(to), to) && !isActive.value) {
      setModelValue();
    }
  });
}
</script>
<style lang="scss">
.c-tabs-item {
  @apply flex justify-center items-center pl-[1.125rem] pr-2 text-p3;

  position: relative;
  height: var(--tab-height);
  padding: 12px 32px;
  border-bottom: 3px solid transparent;
  color: #7f7f7f;
  font-weight: bold;

  &.is-active,
  &:hover {
    border-color: #3f51b5;
    cursor: pointer;
    color: black;
  }
}
</style>
