<template>
  <div :class="['top-0 left-0 w-full h-full z-100 bg-black/50 flex justify-center items-center', position]">
    <LoadingAnimation></LoadingAnimation>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: "fixed" | "absolute";
  }>(),
  {
    position: "absolute",
  },
);
</script>
<style scoped lang="scss"></style>
