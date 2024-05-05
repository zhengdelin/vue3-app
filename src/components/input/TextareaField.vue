<template>
  <InputContainer v-bind="{ ...inputContainerProps, ...inputContainerContext.emitEvents }" class="textarea-field">
    <template v-for="(_, slotName) in inputContainerContext.slots" #[`${slotName}`]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>

    <InputControl
      v-bind="{ ...inputControlProps, ...inputControlContext.emitEvents, active: isActive }"
      ref="inputControlRef"
    >
      <template #default="{ onBlur, onFocus, props: controlProps }">
        <slot name="input" :on-focus="onFocus" :on-blur="onBlur">
          <textarea
            v-model="modelValue"
            v-bind="{ ...controlProps, ...inputProps }"
            @input="onInput"
            @change="onChange"
            @focus.stop="onFocus"
            @blur.stop="onBlur"
          ></textarea>
          <!-- <textarea id="" name="" cols="30" rows="10"></textarea> -->
        </slot>
      </template>
      <template v-for="(_, slotName) in inputControlContext.slots" #[`${slotName}`]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </InputControl>
  </InputContainer>
</template>
<script setup lang="ts">
import {
  InputContainerProps,
  InputContainerEmits,
  createInputContainerContext,
  INPUT_CONTAINER_PROPS_DEFAULT,
} from "./container/composables";
import {
  INPUT_CONTROL_PROPS_DEFAULT,
  InputControlProps,
  InputControlEmits,
  createInputControlContext,
} from "./control/composables";
import InputControl from "@/components/input/control/index.vue";
import { CanDebounceInputProps, createCanDebounceInput } from "./composables";

type ModelValueType = any;

interface InputTextField {
  modelValue?: ModelValueType;
  placeholder?: string;
  autoFocus?: boolean;

  inputProps?: Record<string, any>;
}

const props = withDefaults(
  defineProps<InputControlProps & InputContainerProps & InputTextField & CanDebounceInputProps>(),
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
const inputControlRef = ref<InstanceType<typeof InputControl> | null>(null);

const { modelValue, onChange, onInput, updateModelValue } = createCanDebounceInput(
  { props, emit },
  {
    trigger: props.trigger,
    debounce: props.debounce,
    debounceConfig: props.debounceConfig,
  },
);

const isActive = computed(() => modelValue.value !== "" && modelValue.value !== undefined);

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
$text-color: rgb(55, 65, 81);
$placeholder-color: rgb(107, 114, 128);

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
