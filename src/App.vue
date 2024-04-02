<script setup lang="ts">
import { routes } from "@/router";
import MessageContainer from "@/composables/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composables/useModal/components/ModalContainer.vue";
</script>

<template>
  <div class="min-h-screen flex justify-center my-28">
    <div class="flex flex-col items-center gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <RouterLink v-for="route in routes" :key="route.name" class="btn" :to="{ name: route.name }">
          <Btn>{{ route.path }}</Btn>
        </RouterLink>
      </div>
      <RouterView></RouterView>
    </div>
  </div>
  <MessageContainer />;
  <ModalContainer></ModalContainer>
</template>

<style scoped></style>
