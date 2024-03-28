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
  $radio-size: 20px;
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
      width: $radio-size;
      height: $radio-size;
    }
    input {
      z-index: -1;
    }
    .inner {
      position: absolute;
      border-radius: 50%;
      border: 2px solid #{$agent-grey};
      background-color: #{$agent-white};
      &:hover {
        border-color: #{$agent-primary};
      }
      &::after {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: inherit;
        background-color: #{$agent-primary};

        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.15s ease-in;
      }
    }
  }

  &.is-bordered {
    @extend %agent-border-grey;
    border-radius: 8px;
    padding: v-bind("borderedPadding");

    &.is-active {
      border-color: #{$agent-primary};
    }
  }

  &.is-active &__input .inner {
    border-color: #{$agent-primary};
    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &__label-container {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;

    .label,
    .description {
      @extend %agent-text-p5, %agent-text-black;
    }
  }
}
</style>
