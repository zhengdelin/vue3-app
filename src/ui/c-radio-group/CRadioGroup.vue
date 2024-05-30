<template>
  <div :class="['radio-group', { vertical: direction === 'vertical' }]">
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
  direction?: "vertical" | "horizontal";
  options?: RadioOption[];
}

const props = withDefaults(defineProps<RadioGroup>(), {
    direction: "horizontal",
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
