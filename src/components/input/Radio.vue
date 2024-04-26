<template>
  <label :for="id" :class="['radio', { 'is-bordered': bordered }, { 'is-active': active }]">
    <div class="radio__body">
      <div :class="['radio__input']">
        <input :id="id" v-model="modelValue" type="radio" :value="value" />
        <span class="inner"></span>
      </div>
      <div class="radio__label-container">
        <span class="label">
          {{ label }}
        </span>
        <span v-if="description" class="description"> {{ description }}</span>
      </div>
    </div>
  </label>
</template>
<script setup lang="ts">
import { WritableComputedRef } from "vue";

interface InputRadio {
  value: any;
  label: string;
  description?: string;
  gap?: string;
  bordered?: boolean;
  borderedPadding?: string;
}

const props = withDefaults(defineProps<InputRadio>(), {
  gap: "10px",
  bordered: false,
  borderedPadding: "24px",
});

const instance = getCurrentInstance();
const id = computed(() => `radio-${instance?.uid}`);

const modelValue = inject<WritableComputedRef<any>>("modelValue");

const active = computed(() => props.value === modelValue?.value);
</script>
<style scoped lang="scss">
.radio {
  // default state
  --default-background-color: #fff;
  --default-border-color: #6b7280;
  --default-bordered-border-color: #6b7280;

  // active state
  --active-background-color: blue;
  --active-border-color: #6b7280;
  --active-bordered-border-color: #6b7280;

  // hover state
  --hovered-background-color: var(--default-background-color);
  --hovered-border-color: var(--active-border-color);
  --hovered-bordered-border-color: var(--active-bordered-border-color);

  --background-color: var(--default-background-color);
  --border-color: var(--default-border-color);
  --bordered-border-color: var(--default-bordered-border-color);

  --label-color: #000;
  --size: 20px;
  cursor: pointer;
  &__body {
    display: flex;
    align-items: center;
    gap: v-bind("gap");
    height: 24px;
  }

  &__input {
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
      border: 2px solid var(--border-color);
      // background-color: inherit;
      &::after {
        --inner-size: calc(var(--size) - 8.5px);
        content: "";
        width: var(--inner-size);
        height: var(--inner-size);
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: inherit;
        background-color: var(--background-color);

        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-in;
      }
    }
  }

  &__label-container {
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
    padding: v-bind("borderedPadding");
  }

  &:hover {
    --bordered-border-color: var(--hovered-bordered-border-color);
    --background-color: var(--hovered-background-color);
    --border-color: var(--hovered-border-color);
  }

  &.is-active {
    --bordered-border-color: var(--active-bordered-border-color);
    --background-color: var(--active-background-color);
    --border-color: var(--active-border-color);
  }

  &.is-active,
  &:hover {
    // --inner-scale: 1;
  }
}
</style>
