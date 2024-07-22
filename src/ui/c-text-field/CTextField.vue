<template>
  <c-input-container class="text-field" v-bind="{ ...inputContainerProps, ...inputContainerContext.emitEvents }">
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
      <template v-for="(_, slotName) in inputControlContext.slots" #[`${slotName}`]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </c-input-control>
  </c-input-container>
</template>
<script setup lang="ts" generic="ModelValueType = any">
import useComponentRef from "@/composable/useComponentRef";
import { isSet } from "@/utils/object";
import { INPUT_CONTAINER_PROPS_DEFAULT } from "../c-input-container/constants";
import { InputContainerEmits, InputContainerProps } from "../c-input-container/types";
import { createInputContainerContext } from "../c-input-container/useInputContainer";
import CInputControl from "../c-input-control/CInputControl.vue";
import { INPUT_CONTROL_PROPS_DEFAULT } from "../c-input-control/constants";
import { InputControlEmits, InputControlProps } from "../c-input-control/types";
import { createInputControlContext } from "../c-input-control/useInputControl";
import { CanDebounceInputProps, createCanDebounceInput } from "../composable/useDebounceInput";

interface InputTextField {
  modelValue?: ModelValueType;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;

  inputProps?: Record<string, any>;
}

const props = withDefaults(
  defineProps<InputControlProps & InputContainerProps & InputTextField & CanDebounceInputProps>(),
  {
    ...INPUT_CONTROL_PROPS_DEFAULT,
    ...INPUT_CONTAINER_PROPS_DEFAULT,
    type: "text",
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
const inputControlRef = useComponentRef(CInputControl);

const { modelValue, onChange, onInput, updateModelValue } = createCanDebounceInput(
  { props, emit },
  {
    trigger: props.trigger,
    debounce: props.debounce,
    debounceConfig: props.debounceConfig,
  },
);

const isActive = computed(() => isSet(modelValue.value));

const inputProps = computed(() => {
  const _props = props.inputProps || {};
  const propsClass = _props?.class ? (Array.isArray(_props?.class) ? _props?.class.join(" ") : _props?.class) : "";
  const p = {
    placeholder: props.placeholder,
    type: props.type,
    ..._props,
    class: ["input--field-input", propsClass],
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
.text-field {
  // &.is-disabled {
  //   input {
  //   }
  // }

  input {
    color: inherit;
    outline: none;
    border: none;
  }
}
</style>
