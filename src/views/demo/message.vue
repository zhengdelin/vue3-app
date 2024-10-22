<template>
  <div class="flex gap-2">
    <c-btn @click="showSuccessMessage">點我彈出成功訊息</c-btn>
    <c-btn @click="showErrorMessage">點我彈出失敗訊息</c-btn>
    <c-btn @click="showWarningMessage">點我彈出警告訊息</c-btn>
    <c-btn @click="showInfoMessage">點我彈出訊息訊息</c-btn>
  </div>
</template>
<script setup lang="ts">
import { $message } from "@/composable/useMessage";
function showSuccessMessage() {
  $message.success("成功訊息");
}

function showErrorMessage() {
  $message.error("失敗訊息");
}

function showWarningMessage() {
  $message.warning("警告訊息");
}

function showInfoMessage() {
  $message.info("訊息訊息");
}
</script>
<style scoped lang="scss"></style>
