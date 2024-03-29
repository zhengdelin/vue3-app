<template>
  <Btn @click="toggleLoading">點我切換Loading</Btn>
  <Btn :loading="loading">還沒Loading</Btn>

  <div v-loading style="width: 500px; height: 300px; position: relative">loading directive</div>
</template>
<script setup lang="ts">
import { useLoading } from "@/composables/useLoading";

const { loading, execute } = useLoading();

function toggleLoading() {
  loading.value = !loading.value;
}
</script>
<style scoped lang="scss"></style>
