<template>
  <c-input-container v-bind="{ ...inputContainerProps, ...inputContainerContext.emitEvents }" class="textarea-field">
    <template v-for="(_, slotName) in inputContainerContext.slots" #[`${slotName}`]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>

    <c-input-control
      v-bind="{ ...inputControlProps, ...inputControlContext.emitEvents, active: isActive }"
      ref="inputControlRef"
    >
      <template #default="slotProps">
        <slot name="input" v-bind="slotProps">
          <textarea
            v-model="modelValue"
            v-bind="{ readonly: slotProps.readonly, disabled: slotProps.disabled, ...inputProps }"
            @input="onInput"
            @change="onChange"
            @focus.stop="slotProps.onFocus"
            @blur.stop="slotProps.onBlur"
          ></textarea>
          <!-- <textarea id="" name="" cols="30" rows="10"></textarea> -->
        </slot>
      </template>
      <template v-for="(_, slotName) in inputControlContext.slots" #[`${slotName}`]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </c-input-control>
  </c-input-container>
</template>
<script setup lang="ts">
import useComponentRef from "@/composable/useComponentRef";
import { isSet } from "@/utils/object";
import { INPUT_CONTAINER_PROPS_DEFAULT } from "../c-input-container/constants";
import { InputContainerEmits, InputContainerProps } from "../c-input-container/types";
import { createInputContainerContext } from "../c-input-container/useInputContainer";
import InputControl from "../c-input-control/CInputControl.vue";
import { INPUT_CONTROL_PROPS_DEFAULT } from "../c-input-control/constants";
import { InputControlEmits, InputControlProps } from "../c-input-control/types";
import { createInputControlContext } from "../c-input-control/useInputControl";
import { CanDebounceInputProps, createCanDebounceInput } from "../composable/useDebounceInput";

type ModelValueType = string;

interface TextareaProps {
  modelValue?: ModelValueType;
  placeholder?: string;
  autoFocus?: boolean;

  inputProps?: Record<string, any>;
}

const props = withDefaults(
  defineProps<InputControlProps & InputContainerProps & TextareaProps & CanDebounceInputProps>(),
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
  { props, emit, propName: "modelValue" },
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
.textarea-field {
  // &.is-disabled {
  //   input {
  //   }
  // }

  .input--control {
    --input-field-label-top: calc(var(--input-field-padding-top));
  }

  textarea {
    color: inherit;
    outline: none;
    border: none;
    padding-top: calc(var(--input-field-padding-top) + 5px);
    height: 300px;
    // resize: none;
  }
}
</style>
