<template>
  <!-- <div>{{ modelValue }}</div> -->
  <!-- <button @click="modelValue = !modelValue">toggle</button> -->
  <div class="border border-red-500">
    <input v-model="modelValue.account" type="text" />
  </div>
</template>
<script setup lang="ts">
import { useVDeepModel } from "@/composable/useVModel";

const props = withDefaults(
  defineProps<{
    show: boolean;
    modelValue: any;
  }>(),
  {},
);

const emit = defineEmits(["update:show", "update:modelValue"]);

// const modelValue = useVModel({
//   props,
//   emit,
//   propName: "show",
// });

const modelValue = useVDeepModel({
  props,
  emit,
});
</script>
<style scoped lang="scss"></style>
