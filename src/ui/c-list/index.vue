<template>
  <ul class="c-list">
    <slot></slot>
  </ul>
</template>
<script setup lang="ts">
//
</script>
<style lang="scss">
.c-list {
  list-style: none;
  margin: 0;

  background: white;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  overflow: auto;
  height: 100%;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>
