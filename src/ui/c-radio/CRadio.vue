<template>
  <label :for="id" :class="['c-radio', { 'is-active': active, 'is-disabled': isDisabled, 'is-readonly': isReadonly }]">
    <div class="c-radio--body">
      <div :class="['c-radio--input']">
        <input :id="id" v-model="modelV" type="radio" :value="value" :disabled="isReadonly || isDisabled" />
        <span class="inner-container"></span>
      </div>
      <div class="c-radio--label-container">
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
import { RadioProps } from "./c-radio.types";

const props = withDefaults(defineProps<RadioProps>(), {
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
<style lang="scss">
.c-radio {
  $label-color: #000;
  $radio-inner-background-color: #fff;
  $radio-border-color: #6b7280;
  $radio-background-color: #fff;

  // default
  --label-color: #{$label-color};
  --radio-inner-background-color: #{$radio-inner-background-color};
  --radio-border-color: #{$radio-border-color};
  --radio-background-color: #{$radio-background-color};

  // active state
  --active-label-color: #{$label-color};
  --active-radio-inner-background-color: red;
  --active-radio-border-color: #6b7280;
  --active-background-color: #{$radio-background-color};

  // hover state
  --hovered-label-color: #{$label-color};
  --hovered-radio-inner-background-color: #{$radio-inner-background-color};
  --hovered-radio-border-color: var(--active-radio-border-color);
  --hovered-radio-background-color: var(--active-background-color);

  // disabled-state
  --disabled-label-color: rgb(209, 213, 219);
  --disabled-radio-inner-background-color: #{$radio-inner-background-color};
  --disabled-active-radio-inner-background-color: rgb(209, 213, 219); // disabled時的active的按鈕背景顏色
  --disabled-radio-border-color: rgb(209, 213, 219);
  --disabled-radio-background-color: #{$radio-background-color};
  --disabled-active-radio-background-color: rgb(209, 213, 219); // disabled時的active的按鈕背景顏色

  // readonly-state
  --readonly-label-color: #{$label-color};
  --readonly-radio-inner-background-color: #{$radio-inner-background-color};
  --readonly-active-radio-inner-background-color: var(--active-radio-inner-background-color);
  --readonly-radio-border-color: #{$radio-border-color};
  --readonly-radio-background-color: #{$radio-background-color};
  --readonly-active-radio-background-color: var(--active-radio-background-color);
}

@mixin set-color($label, $radio-border, $radio-background, $radio-inner-background) {
  .c-radio {
    color: $label;
    &--input {
      .inner-container {
        border-color: $radio-border;
        background-color: $radio-background;
        &::after {
          background-color: $radio-inner-background;
        }
      }
    }
  }
}
.c-radio {
  --size: 19px;
  --inner-size: calc(var(--size) - 7px);
  --gap: 10px;
  --bordered-padding: 24px;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  // color: var(--label-color);
  @include set-color(
    var(--label-color),
    var(--radio-border-color),
    var(--radio-background-color),
    var(--radio-inner-background-color)
  );

  &--body {
    display: flex;
    align-items: center;
    gap: var(--gap);
  }

  &--input {
    flex: none;
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

    .inner-container {
      position: absolute;
      border-radius: 50%;
      // border: 1px solid var(--radio-border-color);
      border-style: solid;
      border-width: 1px;
      inset: 0;
      // background-color: var(--radio-background-color);
      // background-color: inherit;
      &::after {
        content: "";
        width: var(--inner-size);
        height: var(--inner-size);
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: inherit;
        // background-color: var(--radio-inner-background-color);

        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-in;
      }
    }
  }

  &--label-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .label,
    .description {
      // font-size: 14px;
      // line-height: 20px;
    }
  }

  &:hover {
    // --radio-inner-background-color: var(--hovered-radio-inner-background-color);
    // --radio-border-color: var(--hovered-radio-border-color);
    // --radio-background-color: var(--hovered-radio-background-color);
    // --label-color: var(--hovered-label-color);
    @include set-color(
      var(--hovered-label-color),
      var(--hovered-radio-border-color),
      var(--hovered-radio-background-color),
      var(--hovered-radio-inner-background-color)
    );
  }

  &.is-active {
    // --radio-inner-background-color: var(--active-radio-inner-background-color);
    // --radio-border-color: var(--active-radio-border-color);
    // --radio-background-color: var(--active-radio-background-color);
    // --label-color: var(--active-label-color);
    @include set-color(
      var(--active-label-color),
      var(--active-radio-border-color),
      var(--active-radio-background-color),
      var(--active-radio-inner-background-color)
    );
  }

  &.is-readonly {
    @include set-color(
      var(--readonly-label-color),
      var(--readonly-radio-border-color),
      var(--readonly-radio-background-color),
      var(--readonly-radio-inner-background-color)
    );
    &.is-active {
      @include set-color(
        var(--readonly-label-color),
        var(--readonly-radio-border-color),
        var(--readonly-active-radio-background-color),
        var(--readonly-active-radio-inner-background-color)
      );
    }
    // &.is-active {
    //   --radio-inner-background-color: var(--readonly-active-radio-inner-background-color);
    //   --radio-background-color: var(--readonly-active-radio-background-color);
    // }
    // --radio-inner-background-color: var(--readonly-radio-inner-background-color);
    // --radio-border-color: var(--readonly-radio-border-color);
    // --radio-background-color: var(--readonly-radio-background-color);
    // --label-color: var(--readonly-label-color);
  }

  &.is-disabled {
    pointer-events: none;
    @include set-color(
      var(--disabled-label-color),
      var(--disabled-radio-border-color),
      var(--disabled-radio-background-color),
      var(--disabled-radio-inner-background-color)
    );
    &.is-active {
      @include set-color(
        var(--disabled-label-color),
        var(--disabled-radio-border-color),
        var(--disabled-active-radio-background-color),
        var(--disabled-active-radio-inner-background-color)
      );
    }
    // &.is-active {
    //   --radio-inner-background-color: var(--disabled-active-radio-inner-background-color);
    //   --radio-background-color: var(--disabled-active-radio-background-color);
    // }
    // --radio-inner-background-color: var(--disabled-radio-inner-background-color);
    // --radio-border-color: var(--disabled-radio-border-color);
    // --radio-background-color: var(--disabled-radio-background-color);
    // --label-color: var(--disabled-label-color);
  }

  // &.is-active,
  // &:hover {
  //   // --inner-scale: 1;
  // }
}
</style>
