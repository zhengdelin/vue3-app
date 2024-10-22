<template>
  <c-btn class="btn" @click="showModal">點我彈出確認視窗</c-btn>
</template>
<script setup lang="ts">
import { $confirm } from "@/composable/useConfirmModal";
import { $message } from "@/composable/useMessage";

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
