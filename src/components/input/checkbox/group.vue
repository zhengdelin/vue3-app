<template>
  <div :class="['checkbox-group', { vertical: direction === 'vertical' }]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composables/useVModel";
import { provideCheckboxGroup } from "./composables";

interface CheckboxGroup {
  modelValue?: any;
  readonly?: boolean;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<CheckboxGroup>(), {
  direction: "horizontal",
});
const emit = defineEmits(["update:modelValue"]);

const modelV = useVModel({
  props,
  emit,
});

const { readonly, disabled } = toRefs(props);

provideCheckboxGroup({
  modelValue: modelV,
  readonly,
  disabled,
});
</script>

<style lang="scss">
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
