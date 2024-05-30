<script setup lang="ts">
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

const data = ref("");
const select = ref("");

onMounted(() => {
  useCorrectVH();
});

const options = computed(() => {
  return [
    {
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
    {
      label: "6",
      value: 6,
    },
    {
      label: "7",
      value: 7,
    },
    {
      label: "8",
      value: 8,
    },
    {
      label: "9",
      value: 9,
    },
    {
      label: "10",
      value: 10,
    },
  ];
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
      <br /><br /><br /><br /><br />
      <c-select v-model="select" label="選擇" placeholder="請選擇" :options="options"></c-select>
      <RouterView></RouterView>
      <!-- <c-text-field v-model="data" label="文字" placeholder="請輸入文字"> </c-text-field>
      <c-textarea v-model="data" label="文字" placeholder="請輸入文字"> </c-textarea> -->
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
