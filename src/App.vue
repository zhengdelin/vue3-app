<script setup lang="ts">
import { routes } from "@/router";
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

const data = ref("");
const select = ref("");

onMounted(() => {
  useCorrectVH();
});
</script>

<template>
  <div class="min-h-screen flex justify-center my-28">
    <div class="flex flex-col items-center gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <RouterLink v-for="route in routes" :key="route.name" class="btn" :to="{ name: route.name }">
          <c-btn>{{ route.path }}</c-btn>
        </RouterLink>
      </div>
      <RouterView></RouterView>
      <c-text-field v-model="data" label="文字" placeholder="請輸入文字"> </c-text-field>
      <InputTextareaField v-model="data" label="文字" placeholder="請輸入文字"> </InputTextareaField>
      <InputSelect v-model="select" label="選擇" placeholder="請選擇"></InputSelect>
      <OverlayTester></OverlayTester>
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
