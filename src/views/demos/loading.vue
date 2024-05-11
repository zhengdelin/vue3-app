<template>
  <c-btn @click="toggleLoading">點我切換Loading</c-btn>
  <c-btn :loading="loading">還沒Loading</c-btn>

  <div v-loading style="width: 500px; height: 300px; position: relative">loading directive</div>
</template>
<script setup lang="ts">
import { useLoading } from "@/composable/useLoading";

const { loading } = useLoading();

function toggleLoading() {
  loading.value = !loading.value;
}
</script>
<style scoped lang="scss"></style>
