<template>
  <div :class="['c-radio-group']">
    <slot>
      <c-radio v-for="option in optionsTransformed" :key="option.value" v-bind="option"></c-radio>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import { provideRadioGroup } from "./useRadioGroup";

type RadioOption =
  | string
  | {
      label: string;
      value: any;
    };
interface RadioGroup {
  modelValue?: any;
  readonly?: boolean;
  disabled?: boolean;
  options?: RadioOption[];
}

const props = withDefaults(defineProps<RadioGroup>(), {
    options: () => [],
  }),
  emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel({ props, emit });
const optionsTransformed = computed(() =>
  props.options.map((option) =>
    typeof option === "string"
      ? {
          label: option,
          value: option,
        }
      : option,
  ),
);

provideRadioGroup({ modelValue, readonly: computed(() => props.readonly), disabled: computed(() => props.disabled) });
</script>
<style lang="scss">
.c-radio-group {
}
</style>
