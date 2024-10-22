<template>
  <div>this is vue typescript template</div>
  <c-btn @click="count++">{{ count }}</c-btn>
</template>
<script setup lang="ts">
const count = ref(0);
</script>
<style scoped lang="scss"></style>
