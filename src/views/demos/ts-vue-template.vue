<template>
  <div>this is vue typescript template</div>
  <Btn @click="count++">{{ count }}</Btn>
</template>
<script setup lang="ts">
const count = ref(0);
</script>
<style scoped lang="scss"></style>
