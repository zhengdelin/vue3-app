<template>
  <c-overlay close-on-click-overlay open-on-hover location-strategy="connected" offset="10px" position="top">
    <template #activator="{ props }">
      <c-btn v-bind="props">切換</c-btn>
    </template>

    <c-btn>content</c-btn>
  </c-overlay>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
