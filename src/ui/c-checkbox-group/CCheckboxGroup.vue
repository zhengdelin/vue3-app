<template>
  <div :class="['c-checkbox-group']">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import { provideCheckboxGroup } from "./useCheckboxGroup";

interface CheckboxGroupProps {
  modelValue?: any;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {});
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
.c-checkbox-group {
}
</style>
