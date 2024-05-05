<template>
  <div
    :class="[
      'input-container',
      size,
      {
        'is-error': isError,
      },
    ]"
  >
    <div v-if="isPrepended" class="prepend" @click="onPrependClick">
      <slot name="prepend"></slot>
    </div>
    <label
      :for="textFieldId"
      :class="[
        'input-control',
        {
          'is-active': isActive,
          'is-required': required,
          'is-labeled': !!label,
          'is-prepended-inner': isPrependedInner,
          'is-appended-inner': isAppendedInner,
          'is-focus': isFocus,
          'is-always-focus': alwaysFocus,
          'is-bordered': isBordered,
          'is-disabled': isDisabled,
          'is-readonly': isReadonly,
          [`bg-${bg}`]: !!bg,
          [`border-${borderColor}`]: isBordered && borderColor,
        },
      ]"
    >
      <div v-if="isPrependedInner" class="prepend-inner" @click="onPrependInnerClick">
        <slot name="prepend-inner"></slot>
      </div>
      <div class="field">
        <span v-if="label" class="label">{{ label }}</span>
        <div class="input" tabindex="1" @focus="onFocus" @blur="onBlur">
          <slot name="input" :on-focus="onFocus" :on-blur="onBlur">
            <input
              v-model="modelV"
              v-bind="inputProps"
              @click="onInputClick"
              @input="onInput"
              @change="onChange"
              @focus.stop="onFocus"
              @blur.stop="onBlur"
            />
            <!-- <textarea id="" name="" cols="30" rows="10"></textarea> -->
          </slot>
        </div>
      </div>
      <div v-if="clearable" class="clearable" @click="clear">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20">
          <path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          />
        </svg>
      </div>
      <div v-if="isAppendInnerSlotPassed" class="append-inner" @click="onAppendInnerClick">
        <slot name="append-inner"></slot>
      </div>
    </label>
    <div v-if="isAppended" class="append" @click="onAppendClick">
      <slot name="append"></slot>
    </div>
    <div class="error-messages">
      <!-- <IconExclamationTriangleFill></IconExclamationTriangleFill> -->
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce as useDebounce } from "@/composables/useDebounceThrottle";
type Trigger = "change" | "input";
interface InputText {
  modelValue?: any;
  label?: string;
  required?: boolean;
  type?: string;
  size?: "large" | "medium" | "small";
  placeholder?: string;

  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  focus?: boolean;
  alwaysFocus?: boolean;

  bg?: string;
  bordered?: boolean;
  borderColor?: string;

  trigger?: Trigger;
  debounce?: boolean;
  debounceInterval?: number;

  error?: boolean;
  errorMessage?: string;

  inputProps?: Record<string, any>;
}

const props = withDefaults(defineProps<InputText>(), {
  label: undefined,
  type: "text",
  placeholder: "",
  required: false,
  inputClass: undefined,
  size: "medium",
  bg: "white",
  bordered: true,
  borderColor: "gray-500",
  readonly: false,
  disabled: false,
  focus: false,
  alwaysFocus: false,
  trigger: "input",
  debounce: false,
  debounceInterval: 300,
  clearable: true,
  error: false,
  errorMessage: "",
});
const emit = defineEmits([
  "update:modelValue",
  "click:append-inner",
  "click:prepend-inner",
  "click:append",
  "click:prepend",
  "click:input",
]);
const slots = useSlots();
const modelV = ref(props.modelValue);
//外側修改時同步資料
watch(
  () => props.modelValue,
  (v) => {
    if (v !== modelV.value) modelV.value = v;
  },
);

function emitModelValue() {
  emit("update:modelValue", modelV.value);
}

function updateModalValue(v: any) {
  modelV.value = v;
  emitModelValue();
}

function output(i: Event) {
  if (!(i as InputEvent).isComposing) emitModelValue();
}
const onChange = (() => {
  if (props.trigger === "change") return output;
})();
const onInput = (() => {
  if (props.trigger === "input") {
    if (props.debounce) {
      return useDebounce(output, { immediately: false, delay: props.debounceInterval });
    }
    return output;
  }
})();

const instance = getCurrentInstance();
const textFieldId = computed(() => `text-field__${instance?.uid}`);
const isActive = computed(() => modelV.value !== "" && modelV.value !== undefined);

// areas
const isPrepended = computed(() => !!slots["prepend"]);
const isAppended = computed(() => !!slots["append"]);
const isPrependedInner = computed(() => !!slots["prepend-inner"]);
const isAppendInnerSlotPassed = computed(() => !!slots["append-inner"]);
const isAppendedInner = computed(() => isAppendInnerSlotPassed.value || !!props.clearable);

const isFocus = ref(props.focus);
const alwaysFocus = ref(props.alwaysFocus);
const isError = computed(() => props.error || props.errorMessage);
const isReadonly = computed(() => props.readonly);
const isDisabled = computed(() => props.disabled);
const isBordered = computed(() => props.bordered);

const inputProps = computed(() => {
  const _props = props.inputProps || {};
  const propsClass = _props?.class ? (Array.isArray(_props?.class) ? _props?.class.join(" ") : _props?.class) : "";
  const p = {
    placeholder: props.placeholder,
    type: props.type,
    readonly: isReadonly.value,
    disabled: isDisabled.value,
    ..._props,
    id: textFieldId.value,
    class: ["input-original", propsClass],
  } as Record<string, any>;
  if (props.autoFocus) {
    p.autoFocus = props.autoFocus;
  }
  return p;
});

function onFocus() {
  isFocus.value = true;
}
function onBlur() {
  isFocus.value = false;
}

const onAppendInnerClick = () => emit("click:append-inner");
const onPrependInnerClick = () => emit("click:prepend-inner");
const onAppendClick = () => emit("click:append");
const onPrependClick = () => emit("click:prepend");
const onInputClick = () => emit("click:input");

function clear() {
  updateModalValue("");
}

defineExpose({
  textFieldId,
  focus: onFocus,
  blur: onBlur,
  clear,
});
</script>

<style scoped lang="scss">
@use "sass:math";

.input-container {
  $text-color: rgb(55, 65, 81);
  $label-color: rgb(209, 213, 219);
  $placeholder-color: rgb(107, 114, 128);
  $border-color: rgb(209, 213, 219);
  $error-text-color: rgb(239, 68, 68);
  $required-color: $error-text-color;

  // 基本顏色設定
  --text-color: #{$text-color};
  --label-color: #{$label-color};
  --placeholder-color: #{$placeholder-color};
  --border-color: #{$border-color};
  --error-text-color: #{$error-text-color};
  --required-color: #{$required-color};

  // hover時，預設文字和placeholder不變
  --hovered-text-color: #{$text-color};
  --hovered-label-color: rgb(55, 65, 81);
  --hovered-placeholder-color: #{$placeholder-color};
  --hovered-border-color: rgb(59, 130, 246);

  // focus時 focus預設繼承自hover
  --focused-text-color: var(--hovered-text-color);
  --focused-label-color: var(--hovered-label-color);
  --focused-placeholder-color: var(--hovered-placeholder-color);
  --focused-border-color: var(--hovered-border-color);

  // disabled時
  --disabled-text-color: rgb(209, 213, 219);
  --disabled-label-color: rgb(209, 213, 219);
  --disabled-placeholder-color: rgb(209, 213, 219);
  --disabled-border-color: rgb(209, 213, 219);

  // readonly時，預設顏色繼承自基本設定
  --readonly-text-color: #{$text-color};
  --readonly-label-color: #{$label-color};
  --readonly-placeholder-color: #{$placeholder-color};
  --readonly-border-color: #{$border-color};

  // error時
  --errored-text-color: rgb(239, 68, 68);
  --errored-label-color: rgb(239, 68, 68);
  --errored-placeholder-color: rgb(239, 68, 68);
  --errored-border-color: rgb(239, 68, 68);
}

.input-container {
  display: grid;
  grid-template-areas:
    "prepend control append"
    "a messages b";
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  grid-template-rows: auto auto;
  $input-padding-left: 16px;
  $input-padding-right: $input-padding-left;

  --input-pl: #{$input-padding-left};
  --input-pr: #{$input-padding-right};
  --input-pt: calc(var(--label-height) + var(--input-py));
  --input-pb: var(--input-py);

  --input-field-height: calc(var(--input-height) + var(--input-pt) + var(--input-pb));

  position: relative;
  width: 100%;
  // height: var(--height, 40px);

  &.large {
    // 60px
    --input-py: 6px;
    --input-height: 28px;
    --label-height: 18px;
  }
  &.medium {
    // 52px
    --input-py: 5px;
    --label-height: 16px;
    --input-height: 24px;
  }

  &.small {
    // 44px
    --input-py: 4px;
    --label-height: 14px;
    --input-height: 20px;
  }

  .error-messages {
    grid-area: messages;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    color: var(--error-text-color);
    display: flex;
    gap: 4px;
    height: 0;
    margin-top: 4px;
    overflow: hidden;
    transition: height 0.2s;
  }

  &.is-error .error-messages {
    // display: flex;
    height: 24px;
  }

  &.is-error &--input-control {
    --border-color: var(--errored-border-color);
    --label-color: var(--errored-label-color);
    --placeholder-color: var(--errored-placeholder-color);
    --text-color: var(--errored-text-color);
  }

  .prepend,
  .append {
    display: flex;
    align-items: center;
  }

  .prepend {
    grid-area: prepend;
    margin-inline-end: 16px;
  }
  .append {
    grid-area: append;
    margin-inline-start: 16px;
  }

  .input-control {
    $transition-duration: 100ms;

    $appendedPrependedPadding: $input-padding-left * 0.75;

    grid-area: control;
    display: flex;
    overflow: hidden;
    border-radius: 6px;
    // padding: 5px $input-padding-left;
    position: relative;

    &.is-labeled {
      .field input::placeholder {
        opacity: 0;
      }
    }

    &:not(.is-labeled) {
      --input-pt: var(--input-py);
    }
    &.is-prepended-inner {
      padding-inline-start: $appendedPrependedPadding;
      --input-pl: #{math.div($input-padding-left, 2)};
    }

    &.is-appended-inner,
    &.is-clearable {
      padding-inline-end: $appendedPrependedPadding;
      --input-pr: #{math.div($input-padding-right, 2)};
    }

    .field {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
      height: var(--input-field-height);

      .label {
        font-size: 14px;
        line-height: 20px;
        color: var(--label-color);
        font-weight: bold;
        touch-action: none;
        pointer-events: none;
        z-index: 10;
        position: absolute;
        // top: calc(var(--label-height));
        top: calc(50% - var(--label-height) / 2);
        margin-left: var(--input-pl);
        transition-property: top, font-size, line-height;
        transition-duration: $transition-duration;
        transition-timing-function: ease-out;
        white-space: nowrap;
      }

      .input {
        display: flex;
        align-items: center;
        flex: 1;
        padding-top: var(--input-pt);
        padding-bottom: var(--input-pb);
        padding-left: var(--input-pl);
        padding-right: var(--input-pr);
        background: inherit;
        cursor: text;
        color: var(--text-color);

        :deep(.input-original) {
          &::placeholder {
            color: var(--placeholder-color);
            font-size: inherit;
            line-height: inherit;
          }

          font-size: 16px;
          line-height: var(--input-height);
          outline: none;
          border: none;
          width: 100%;
          background: inherit;
        }
      }
    }

    &.is-bordered {
      border: 1px solid var(--border-color);
    }

    &.is-focus {
      --border-color: var(--focused-border-color);
      --text-color: var(--focused-text-color);
      --label-color: var(--focused-label-color);
      --placeholder-color: var(--focused-placeholder-color);
    }

    &.is-focus,
    &.is-always-focus,
    &.is-active {
      .field {
        .label {
          top: var(--input-py);
          font-size: 12px;
          line-height: var(--label-height);
        }

        .input input::placeholder {
          opacity: 1;
        }
      }
    }

    &.is-required .label::after {
      @apply text-p2;
      color: var(--required-color);

      content: "*";
      position: absolute;
      line-height: inherit;
      right: -11px;
      height: 100%;
    }

    &.is-disabled {
      pointer-events: none;
      --text-color: var(--disabled-text-color);
      --label-color: var(--disabled-label-color);
      --placeholder-color: var(--disabled-placeholder-color);
      --border-color: var(--disabled-border-color);
    }

    &.is-readonly {
      --text-color: var(--readonly-text-color);
      --label-color: var(--readonly-label-color);
      --placeholder-color: var(--readonly-placeholder-color);
      --border-color: var(--readonly-border-color);
    }

    &:hover {
      --text-color: var(--hovered-text-color);
      --label-color: var(--hovered-label-color);
      --placeholder-color: var(--hovered-placeholder-color);
      --border-color: var(--hovered-border-color);
      &:not(.is-readonly) {
        .clearable {
          opacity: 1;
        }
      }
    }

    .prepend-inner,
    .append-inner,
    .clearable {
      display: flex;
      align-items: center;
    }

    .append-inner,
    .clearable {
      cursor: pointer;
    }

    .clearable {
      opacity: 0;
      transition: opacity 0.2s;

      margin-inline: 4px;
    }
  }
}
</style>
