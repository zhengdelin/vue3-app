<template>
  <template v-if="isEmpty">
    <slot name="empty">
      <div v-if="text">{{ text }}</div>
    </slot>
  </template>
  <template v-else>
    <slot :data="(data as Defined<NonNullable<T>>)"></slot>
  </template>
</template>

<script setup lang="ts" generic="T">
import { isObjectNullOrEmpty } from "@/utils/object";
const props = withDefaults(
  defineProps<{
    data: T;
    text?: string;
  }>(),
  {},
);

const isEmpty = computed(() => isObjectNullOrEmpty(props.data));
</script>

<style scoped></style>
