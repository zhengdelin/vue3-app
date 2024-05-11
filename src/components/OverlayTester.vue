<template>
  <c-overlay close-on-click-overlay bg="rgba(0, 0, 0, 0.2)" open-on-click absolute>
    <template #activator="{ props }">
      <c-btn v-bind="props">切換</c-btn>
    </template>
    overlay
  </c-overlay>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
