<template>
  <li class="c-list-item">
    <div class="content">
      <slot>
        <slot name="title">
          {{ title }}
        </slot>
      </slot>
    </div>
  </li>
</template>
<script setup lang="ts">
interface ListItemProps {
  title?: string;
}

withDefaults(defineProps<ListItemProps>(), {});
</script>
<style lang="scss">
.c-list-item {
  padding: 4px 16px;
  max-width: 100%;
  min-height: 48px;
  display: grid;
  grid-template-areas: "prepend content append";
  grid-template-columns: max-content 1fr auto;
  position: relative;
  cursor: pointer;

  .content {
    align-self: center;
  }
}
</style>
