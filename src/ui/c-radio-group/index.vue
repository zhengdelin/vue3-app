<template>
  <div :class="['radio-group', { vertical: direction === 'vertical' }]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import { provideRadioGroup } from "./useRadioGroup";
interface RadioGroup {
  modelValue?: any;
  readonly?: boolean;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<RadioGroup>(), {
    direction: "horizontal",
  }),
  emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel({ props, emit });

provideRadioGroup({ modelValue, readonly: computed(() => props.readonly), disabled: computed(() => props.disabled) });
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
