<script setup lang="ts">
import { routes } from "@/router";
</script>

<template>
  <div class="flex gap-2">
    <RouterLink v-for="route in routes" :key="route.name" :to="{ name: route.name }">{{ route.name }}</RouterLink>
  </div>
  <RouterView></RouterView>
</template>

<style scoped></style>
