<template>
  <c-input-container class="select-field" v-bind="{ ...inputContainerProps, ...inputContainerContext.emitEvents }">
    <template v-for="(_, slotName) in inputContainerContext.slots" #[`${slotName}`]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>

    <c-input-control
      v-bind="{ ...inputControlProps, ...inputControlContext.emitEvents, active: isActive }"
      ref="inputControlRef"
    >
      <template #default="slotProps">
        <slot name="input" v-bind="slotProps">
          <input
            :value="modelValue"
            v-bind="{ readonly: slotProps.readonly, disabled: slotProps.disabled, ...inputProps }"
            @input="onInput"
            @change="onChange"
            @focus.stop="slotProps.onFocus"
            @blur.stop="slotProps.onBlur"
          />
          <!-- <textarea id="" name="" cols="30" rows="10"></textarea> -->
        </slot>
      </template>
      <template #append-inner="{ focus }">
        <svg v-if="focus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16">
          <path
            d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16">
          <path
            d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
          />
        </svg>
      </template>
      <template v-for="(_, slotName) in inputControlContext.slots" #[`${slotName}`]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </c-input-control>
  </c-input-container>
</template>
<script setup lang="ts" generic="ModelValueType = any">
import InputControl from "../c-input-control/index.vue";
import { InputControlEmits, InputControlProps } from "../c-input-control/types";
import { InputContainerEmits, InputContainerProps } from "../c-input-container/types";
import { CanDebounceInputProps, createCanDebounceInput } from "../composable/useDebounceInput";
import { INPUT_CONTROL_PROPS_DEFAULT } from "../c-input-control/constants";
import { INPUT_CONTAINER_PROPS_DEFAULT } from "../c-input-container/constants";
import { createInputContainerContext } from "../c-input-container/useInputContainer";
import { createInputControlContext } from "../c-input-control/useInputControl";
import useComponentRef from "@/composable/useComponentRef";
import { isSet } from "@/utils/object";

interface InputSelectProps {
  modelValue?: ModelValueType;
  placeholder?: string;
  autoFocus?: boolean;

  inputProps?: Record<string, any>;
}

const props = withDefaults(
  defineProps<InputControlProps & InputContainerProps & InputSelectProps & CanDebounceInputProps>(),
  {
    ...INPUT_CONTROL_PROPS_DEFAULT,
    ...INPUT_CONTAINER_PROPS_DEFAULT,
    placeholder: "",
    autoFocus: false,
    trigger: "input",
    debounce: false,
    debounceConfig: () => ({
      immediately: false,
      delay: 300,
    }),
    inputProps: undefined,
  },
);

type InputTextFieldEmits = InputContainerEmits &
  InputControlEmits & {
    (e: "update:modelValue", value: ModelValueType): void;
  };

const emit = defineEmits<InputTextFieldEmits>();
const slots = useSlots();

// 透傳
// container
const inputContainerContext = createInputContainerContext(props, emit, slots);
const inputContainerProps = inputContainerContext.props;
// control
const inputControlContext = createInputControlContext(props, emit, slots);
const inputControlProps = inputControlContext.props;
inputControlContext.emitEvents["onClear"] = () => updateModelValue("");

// refs
const inputControlRef = useComponentRef(InputControl);
const { modelValue, onChange, onInput, updateModelValue } = createCanDebounceInput(
  { props, emit },
  {
    trigger: props.trigger,
    debounce: props.debounce,
    debounceConfig: props.debounceConfig,
  },
);

const isActive = computed(() => isSet(modelValue.value));
const readonly = computed(() => true);

const inputProps = computed(() => {
  const _props = props.inputProps || {};
  const propsClass = _props?.class ? (Array.isArray(_props?.class) ? _props?.class.join(" ") : _props?.class) : "";
  const p = {
    placeholder: props.placeholder,
    ..._props,
    class: ["input--field-input", propsClass],
    readonly: readonly.value,
  } as Record<string, any>;
  if (props.autoFocus) {
    p.autoFocus = props.autoFocus;
  }
  return p;
});

defineExpose({
  focus: () => inputControlRef.value?.focus(),
  blur: () => inputControlRef.value?.blur(),
  clear: () => inputControlContext.emitEvents["onClear"](),
});
</script>

<style scoped lang="scss">
.select-field {
  input {
    color: inherit;
    outline: none;
    border: none;
    cursor: pointer;
  }
}
</style>
