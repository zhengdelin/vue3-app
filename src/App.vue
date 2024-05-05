<script setup lang="ts">
import { routes } from "@/router";
import MessageContainer from "@/composables/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composables/useModal/components/ModalContainer.vue";

const data = ref("");
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
      <InputTextField v-model="data" label="文字" placeholder="請輸入文字"> </InputTextField>
      <InputTextareaField v-model="data" label="文字" placeholder="請輸入文字"> </InputTextareaField>
    </div>
  </div>
  <MessageContainer />;
  <ModalContainer></ModalContainer>
</template>

<style></style>
