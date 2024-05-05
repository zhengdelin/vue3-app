<template>
  <div
    :class="[
      'input--control',
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
      },
    ]"
  >
    <div v-if="isPrependedInner" class="prepend-inner" @click="onPrependInnerClick">
      <slot name="prepend-inner"></slot>
    </div>
    <div class="input--field">
      <span v-if="label" class="label">{{ label }}</span>
      <slot :on-focus="onFocus" :on-blur="onBlur" :props="inputProps"> </slot>
    </div>
    <div v-if="clearable" class="clearable" @click="onClear">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>
    <div v-if="isAppendInnerSlotPassed" class="append-inner" @click="onAppendInnerClick">
      <slot name="append-inner"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createEmitEvents, INPUT_CONTROL_PROPS_DEFAULT, InputControlProps, InputControlEmits } from "./composables";

const props = withDefaults(defineProps<InputControlProps>(), {
  ...INPUT_CONTROL_PROPS_DEFAULT,
});

const emit = defineEmits<InputControlEmits>();
const slots = useSlots();

const isActive = computed(() => props.active);

// areas
const isPrependedInner = computed(() => !!slots["prepend-inner"]);
const isAppendInnerSlotPassed = computed(() => !!slots["append-inner"]);
const isAppendedInner = computed(() => isAppendInnerSlotPassed.value || !!props.clearable);

const isFocus = ref(props.focus);
const alwaysFocus = ref(props.alwaysFocus);
const isReadonly = computed(() => props.readonly);
const isDisabled = computed(() => props.disabled);
const isBordered = computed(() => props.bordered);

function onFocus() {
  isFocus.value = true;
}
function onBlur() {
  isFocus.value = false;
}

const {
  "onClick:append-inner": onAppendInnerClick,
  onClear,
  "onClick:prepend-inner": onPrependInnerClick,
} = createEmitEvents(emit);

const inputProps = computed(() => {
  return {
    disabled: isDisabled.value,
    readonly: isReadonly.value,
  };
});

defineExpose({
  clear: onClear,
  focus: onFocus,
  blur: onBlur,
});
</script>

<style lang="scss">
@use "sass:math";

$text-color: rgb(55, 65, 81);
$label-color: rgb(209, 213, 219);
$placeholder-color: rgb(107, 114, 128);
$border-color: rgb(209, 213, 219);
$required-color: rgb(239, 68, 68);

$input-padding-start: 16px;
$input-padding-end: $input-padding-start;
$appendedPrependedPadding: $input-padding-start * 0.75;

.input--control {
  // 基本顏色設定
  --text-color: #{$text-color};
  --label-color: #{$label-color};
  --placeholder-color: #{$placeholder-color};
  --border-color: #{$border-color};
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

.input--control {
  --input-field-label-size: 0px;
  --input-field-label-height: calc(var(--input-field-label-size) * 1.5);
  --input-field-label-floating-top: 7px;

  --input-field-padding-start: #{$input-padding-start};
  --input-field-padding-end: #{$input-padding-end};
  --input-field-padding-top: calc(4px + var(--input-field-label-size, 0px));
  --input-field-padding-bottom: 4px;

  grid-area: control;
  display: flex;
  overflow: hidden;
  border-radius: 6px;
  position: relative;
  font-size: 16px;
  // height: var(--input-control-height);

  &.is-prepended-inner {
    padding-inline-start: $appendedPrependedPadding;
    --input-field-padding-start: #{math.div($input-padding-start, 2)};
  }

  &.is-appended-inner,
  &.is-clearable {
    padding-inline-end: $appendedPrependedPadding;
    --input-field-padding-end: #{math.div($input-padding-end, 2)};
  }

  &.is-labeled {
    --input-field-label-size: 14px;
    ::placeholder {
      opacity: 0;
    }
  }

  // &:not(.is-labeled) .input--field {
  //   --input-field-label-size: 0px;
  // }

  .input--field {
    display: flex;
    flex: 1;
    width: 100%;
    position: relative;
    color: var(--text-color);
    // height: var(--input-field-height);

    ::placeholder {
      color: var(--placeholder-color);
    }

    .label {
      font-size: var(--input-field-label-size);
      color: var(--label-color);
      font-weight: bold;
      touch-action: none;
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: calc(50% - (var(--input-field-label-height) / 2) - 1px);
      margin-inline-start: var(--input-field-padding-start);
      margin-inline-end: var(--input-field-padding-end);
      transition-property: top, font-size, line-height;
      transition-duration: 100ms;
      transition-timing-function: ease-out;
      white-space: nowrap;
    }
  }

  &.is-bordered {
    outline: 1px solid var(--border-color);
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
    .input--field {
      --input-field-label-size: 12px;
      .label {
        top: var(--input-field-label-floating-top);
      }

      ::placeholder {
        opacity: 1;
      }
    }
  }

  &.is-required .label::after {
    color: var(--required-color);
    font: inherit;
    content: "*";
    position: absolute;
    right: -11px;
    height: 100%;
  }

  &.is-disabled {
    pointer-events: none;
    touch-action: none;
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

.input--container {
  &.large {
    .input--control {
      // --input-field-label-floating-top: 10px;
    }
  }
}
</style>
