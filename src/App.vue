<script setup lang="ts">
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

onMounted(() => {
  useCorrectVH();
});
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
  <MessageContainer></MessageContainer>
  <ModalContainer>
    <template #loading>
      <div v-loading></div>
    </template>
  </ModalContainer>
</template>

<style></style>
