<template>
  <c-overlay class="c-menu" location-strategy="connected" absolute open-on-click open-on-focus>
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>
    <slot></slot>
  </c-overlay>
</template>
<script setup lang="ts">
//
</script>
<style lang="scss">
.c-menu {
  .overlay--content {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
  }
}
</style>
