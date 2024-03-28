<template>
  <div :class="['radio-group', { vertical: direction === 'vertical' }]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composables/useVModel";
interface RadioGroup {
  modelValue: any;
  direction?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<RadioGroup>(), {
    direction: "horizontal",
  }),
  emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel({ props, emit });

provide("modelValue", modelValue);
</script>
<style scoped lang="scss">
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  &.vertical {
    flex-direction: column;
  }
}
</style>
