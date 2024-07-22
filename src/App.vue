<script setup lang="ts">
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

onMounted(() => {
  useCorrectVH();
});
</script>

<template>
  <div class="min-h-screen flex justify-center my-28">
    <div class="flex flex-col items-center gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <RouterLink v-for="route in $router.getRoutes()" :key="route.name" class="btn" :to="{ name: route.name }">
          <c-btn>{{ route.path }}</c-btn>
        </RouterLink>
      </div>
      <RouterView></RouterView>
    </div>
  </div>
  <MessageContainer></MessageContainer>;
  <ModalContainer>
    <template #loading>
      <div v-loading></div>
    </template>
  </ModalContainer>
</template>

<style></style>
