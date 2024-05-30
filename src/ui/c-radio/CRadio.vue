<template>
  <label
    :for="id"
    :class="[
      'radio',
      { 'is-bordered': bordered, 'is-active': active, 'is-disabled': isDisabled, 'is-readonly': isReadonly },
    ]"
  >
    <div class="radio--body">
      <div :class="['radio--input']">
        <input :id="id" v-model="modelV" type="radio" :value="value" :disabled="isReadonly || isDisabled" />
        <span class="inner"></span>
      </div>
      <div class="radio--label-container">
        <span class="label">
          <slot>{{ label }}</slot>
        </span>
        <span v-if="description" class="description"> {{ description }}</span>
      </div>
    </div>
  </label>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import { RADIO_GROUP_INJECTION_KEY } from "../c-radio-group/constants";

interface RadioProps {
  modelValue?: any;
  value: any;
  label?: string;
  description?: string;
  bordered?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<RadioProps>(), {
  bordered: false,
  label: "",
  description: "",
  disabled: undefined,
  readonly: undefined,
});
const emit = defineEmits(["update:modelValue"]);

const instance = getCurrentInstance();
const id = computed(() => `radio-${instance?.uid}`);

const injection = inject(
  RADIO_GROUP_INJECTION_KEY,
  () => ({
    modelValue: useVModel({ props, emit }),
    disabled: computed(() => false),
    readonly: computed(() => false),
  }),
  true,
);

const { modelValue: modelV } = injection;
const isReadonly = computed(() => !!(props.readonly ?? injection.readonly.value));
const isDisabled = computed(() => !!(props.disabled ?? injection.disabled.value));

const active = computed(() => props.value === modelV.value);
</script>
<style scoped lang="scss">
.radio {
  $label-color: #000;
  $inner-background-color: #fff;
  $btn-border-color: #6b7280;
  $bordered-border-color: #6b7280;

  // default
  --label-color: #{$label-color};
  --inner-background-color: #{$inner-background-color};
  --btn-border-color: #{$btn-border-color};
  --bordered-border-color: #{$bordered-border-color};

  // active state
  --active-label-color: #{$label-color};
  --active-inner-background-color: red;
  --active-btn-border-color: #6b7280;
  --active-bordered-border-color: #6b7280;

  // hover state
  --hovered-label-color: #{$label-color};
  --hovered-inner-background-color: #{$inner-background-color};
  --hovered-btn-border-color: var(--active-btn-border-color);
  --hovered-bordered-border-color: var(--active-bordered-border-color);

  // disabled-state
  --disabled-label-color: rgb(209, 213, 219);
  --disabled-inner-background-color: #{$inner-background-color};
  --disabled-active-inner-background-color: rgb(209, 213, 219); // disabled時的active的按鈕背景顏色
  --disabled-btn-border-color: rgb(209, 213, 219);
  --disabled-bordered-border-color: rgb(209, 213, 219);

  // readonly-state
  --readonly-label-color: #{$label-color};
  --readonly-inner-background-color: #{$inner-background-color};
  --readonly-active-inner-background-color: var(--active-inner-background-color);
  --readonly-btn-border-color: #{$btn-border-color};
  --readonly-bordered-border-color: #{$bordered-border-color};
}
.radio {
  --size: 19px;
  --inner-size: calc(var(--size) - 7px);
  --gap: 10px;
  --bordered-padding: 24px;
  cursor: pointer;
  &--body {
    display: flex;
    align-items: center;
    gap: var(--gap);
    height: 24px;
  }

  &--input {
    position: relative;
    display: flex;
    align-items: center;

    input,
    .inner {
      width: var(--size);
      height: var(--size);
    }

    input {
      z-index: -1;
      visibility: hidden;
    }

    .inner {
      position: absolute;
      border-radius: 50%;
      border: 1px solid var(--btn-border-color);
      inset: 0;
      // background-color: inherit;
      &::after {
        content: "";
        width: var(--inner-size);
        height: var(--inner-size);
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: inherit;
        background-color: var(--inner-background-color);

        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-in;
      }
    }
  }

  &--label-container {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;

    .label,
    .description {
      font-size: 14px;
      line-height: 20px;
      color: var(--label-color);
    }
  }

  &.is-bordered {
    border: 1px solid var(--bordered-border-color);
    border-radius: 8px;
    padding: var(--bordered-padding);
  }

  &:hover {
    --bordered-border-color: var(--hovered-bordered-border-color);
    --inner-background-color: var(--hovered-inner-background-color);
    --btn-border-color: var(--hovered-btn-border-color);
    --label-color: var(--hovered-label-color);
  }

  &.is-active {
    --bordered-border-color: var(--active-bordered-border-color);
    --inner-background-color: var(--active-inner-background-color);
    --btn-border-color: var(--active-btn-border-color);
    --label-color: var(--active-label-color);
  }

  &.is-readonly {
    --bordered-border-color: var(--readonly-bordered-border-color);
    &.is-active {
      --inner-background-color: var(--readonly-active-inner-background-color);
    }
    --inner-background-color: var(--readonly-inner-background-color);
    --btn-border-color: var(--readonly-btn-border-color);
    --label-color: var(--readonly-label-color);
  }

  &.is-disabled {
    pointer-events: none;
    --bordered-border-color: var(--disabled-bordered-border-color);
    &.is-active {
      --inner-background-color: var(--disabled-active-inner-background-color);
    }
    --inner-background-color: var(--disabled-inner-background-color);
    --btn-border-color: var(--disabled-btn-border-color);
    --label-color: var(--disabled-label-color);
  }

  // &.is-active,
  // &:hover {
  //   // --inner-scale: 1;
  // }
}
</style>
