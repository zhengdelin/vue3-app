<template>
  <Btn @click="showSuccessMessage">點我彈出成功訊息</Btn>
  <Btn @click="showErrorMessage">點我彈出失敗訊息</Btn>
  <Btn @click="showWarningMessage">點我彈出警告訊息</Btn>
  <Btn @click="showInfoMessage">點我彈出訊息訊息</Btn>
</template>
<script setup lang="ts">
import { $message } from "@/composables/useMessage";
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
