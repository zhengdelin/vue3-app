<template>
  <div
    :class="[
      'text-field',
      size,
      {
        'is-error': error,
      },
    ]"
  >
    <label
      :for="textFieldId"
      :class="[
        'text-field__input-control',
        {
          'is-active': isActive,
          'is-required': required,
          'is-labeled': !!label,
          'is-prepended': isPrepended,
          'is-appended': isAppended,
          'is-focus': isFocus,
          'is-always-focus': alwaysFocus,
          'is-bordered': bordered,
          [`bg-${bg}`]: !!bg,
          [`border-${borderColor}`]: bordered && borderColor,
        },
      ]"
    >
      <div v-if="isPrepended" class="prepend-inner">
        <slot name="prepend-inner"></slot>
      </div>
      <div class="field">
        <span v-if="label" class="label">{{ label }}</span>
        <div class="input" tabindex="1" @focus="onFocus" @blur="onBlur">
          <slot name="input" :on-focus="onFocus" :on-blur="onBlur">
            <input
              :id="textFieldId"
              v-model="modelV"
              :class="['input-original', inputClass]"
              :placeholder="placeholder"
              :type="type"
              :readonly="readonly"
              :autofocus="autoFocus"
              @click="onInputClick"
              @input="onInput"
              @change="onChange"
              @focus.stop="onFocus"
              @blur.stop="onBlur"
            />
          </slot>
        </div>
      </div>
      <div v-if="clearable" class="clearable" @click="clear">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>alpha-x-circle-outline</title>
          <path
            d="M9,7H11L12,9.5L13,7H15L13,12L15,17H13L12,14.5L11,17H9L11,12L9,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
          />
        </svg>
      </div>
      <div v-if="isAppendInnerSlotPassed" class="append-inner" @click="onAppendInnerClick">
        <slot name="append-inner"></slot>
      </div>
    </label>
    <div class="error-messages">
      <IconExclamationTriangleFill></IconExclamationTriangleFill>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from "@/composables/useDebounceThrottle";
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
  autoFocus?: boolean;
  focus?: boolean;
  alwaysFocus?: boolean;
  inputClass?: string;

  bg?: string;
  bordered?: boolean;
  borderColor?: string;

  trigger?: Trigger;
  debounce?: boolean;
  debounceInterval?: number;

  error?: boolean;
  errorMessage?: string;
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
    focus: false,
    alwaysFocus: false,
    trigger: "input",
    debounce: false,
    debounceInterval: 300,
    clearable: true,
    error: false,
    errorMessage: "",
  }),
  emit = defineEmits(["update:modelValue", "click:append-inner", "click:input"]);
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
    if (props.debounce) return debounce(output, { immediately: false, delay: props.debounceInterval });
    return output;
  }
})();

const instance = getCurrentInstance();
const textFieldId = computed(() => `text-field__${instance?.uid}`);
const isActive = computed(() => !!modelV.value);
const isPrepended = computed(() => !!slots["prepend-inner"]);
const isAppendInnerSlotPassed = computed(() => !!slots["append-inner"]);
const isAppended = computed(() => isAppendInnerSlotPassed.value || !!props.clearable);

const isFocus = ref(props.focus);
const alwaysFocus = ref(props.alwaysFocus);
const error = computed(() => props.error || props.errorMessage);

function onFocus() {
  isFocus.value = true;
}
function onBlur() {
  isFocus.value = false;
}

function onAppendInnerClick() {
  emit("click:append-inner");
}

function onInputClick() {
  emit("click:input");
}

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
.text-field {
  $input-padding-left: 16px;
  $input-padding-right: $input-padding-left;

  // --text-field-height: 40px;
  --text-field-error-color: rgb(239, 68, 68);
  --text-field-error-border-color: rgb(239, 68, 68);
  --text-field-label-color: rgb(209, 213, 219);
  --text-field-placeholder-color: rgb(107, 114, 128);
  --text-field-focus-border-color: rgb(59, 130, 246);
  --text-field-input-pl: #{$input-padding-left};
  --text-field-input-pr: #{$input-padding-right};
  --text-field-input-pt: calc(var(--text-field-label-height) + var(--text-field-input-py));
  --text-field-input-pb: var(--text-field-input-py);

  --text-field-input-field-height: calc(var(--text-field-input-height) + var(--text-field-input-pt) + var(--text-field-input-pb));

  position: relative;
  width: 100%;
  // height: var(--text-field-height, 40px);

  &.large {
    // 60px
    --text-field-input-py: 6px;
    --text-field-input-height: 28px;
    --text-field-label-height: 18px;
  }
  &.medium {
    // 52px
    --text-field-input-py: 5px;
    --text-field-label-height: 16px;
    --text-field-input-height: 24px;
  }

  &.small {
    // 44px
    --text-field-input-py: 4px;
    --text-field-label-height: 14px;
    --text-field-input-height: 20px;
  }

  .error-messages {
    @apply text-p3;
    color: var(--text-field-error-color);
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
  &.is-error &__input-control {
    border-color: var(--text-field-error-border-color);
  }

  &__input-control {
    $transition-duration: 100ms;

    $appendedPrependedPadding: $input-padding-left * 0.75;

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
      --text-field-input-pt: var(--text-field-input-py);
    }
    &.is-prepended {
      padding-left: $appendedPrependedPadding;
      --text-field-input-pl: #{math.div($input-padding-left, 2)};
    }

    &.is-appended,
    &.is-clearable {
      padding-right: $appendedPrependedPadding;
      --text-field-input-pr: #{math.div($input-padding-right, 2)};
    }

    .field {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
      height: var(--text-field-input-field-height);

      .label {
        font-size: 14px;
        line-height: 20px;
        color: var(--text-field-label-color);
        font-weight: bold;
        touch-action: none;
        pointer-events: none;
        z-index: 10;
        position: absolute;
        // top: calc(var(--text-field-label-height));
        top: calc(50% - var(--text-field-label-height) / 2);
        margin-left: var(--text-field-input-pl);
        transition-property: top, font-size, line-height;
        transition-duration: $transition-duration;
        transition-timing-function: ease-out;
        white-space: nowrap;
      }

      .input {
        display: flex;
        align-items: center;
        flex: 1;
        padding-top: var(--text-field-input-pt);
        padding-bottom: var(--text-field-input-pb);
        padding-left: var(--text-field-input-pl);
        padding-right: var(--text-field-input-pr);
        background: inherit;
        cursor: text;

        :deep(.input-original) {
          &::placeholder {
            color: var(--text-field-placeholder-color);
            font-size: inherit;
            line-height: inherit;
          }

          font-size: 16px;
          line-height: var(--text-field-input-height);
          outline: none;
          border: none;
          width: 100%;
          background: inherit;
        }
      }
    }

    &.is-bordered {
      border-width: 1px;
      border-style: solid;
    }

    &.is-focus {
      border-color: var(--text-field-focus-border-color);
    }

    &.is-focus,
    &.is-always-focus,
    &.is-active {
      .field {
        .label {
          top: var(--text-field-input-py);
          font-size: 12px;
          line-height: var(--text-field-label-height);
        }

        .input input::placeholder {
          opacity: 1;
        }
      }
    }

    &.is-required .label::after {
      @apply text-p2;
      color: var(--text-field-error-color);

      content: "*";
      position: absolute;
      line-height: inherit;
      right: -11px;
      height: 100%;
    }

    .prepend-inner,
    .append-inner,
    .clearable {
      display: flex;
      align-items: center;
      width: 24px;
    }

    .append-inner,
    .clearable {
      cursor: pointer;
    }

    .clearable {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      .clearable {
        opacity: 1;
      }
    }
  }
}
</style>
