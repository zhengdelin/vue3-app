<template>
  <div>this is vue3 javascript setup</div>
  <Btn @click="count++">{{ count }}</Btn>
</template>
<script setup>
const count = ref(0);
</script>
<style scoped lang="scss"></style>
