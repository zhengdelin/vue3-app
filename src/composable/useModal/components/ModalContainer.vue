<template>
  <template v-for="modalContainer in modalContainers" :key="modalContainer.id">
    <Suspense>
      <component :is="modalContainer.modal" v-bind="modalContainer.props"></component>
      <template #fallback>
        <slot name="loading"></slot>
      </template>
    </Suspense>
  </template>
</template>
<script setup lang="ts">
import { modalContainers } from "../modal";
</script>
<style scoped lang="scss"></style>
