<template>
  <Btn class="btn" @click="showModal">點我彈出確認視窗</Btn>
</template>
<script setup lang="ts">
import { $confirm } from "@/composables/useConfirmModal";
import { $message } from "@/composables/useMessage";

const showModal = () => {
  $confirm({
    title: "確認彈窗標題",
    text: "確認彈窗文字",
    onConfirm() {
      $message.success("成功");
      return true;
    },
  });
};
</script>
<style scoped lang="scss"></style>
