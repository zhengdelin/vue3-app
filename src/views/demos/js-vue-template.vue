<template>
  <div>this is vue3 javascript setup</div>
  <c-btn @click="count++">{{ count }}</c-btn>
</template>
<script setup>
const count = ref(0);
</script>
<style scoped lang="scss"></style>
