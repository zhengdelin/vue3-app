<template>
  <component
    :is="renderer()"
    :class="['c-btn', { 'is-disabled': disabled, 'is-loading': loading, 'c-btn--block': block }]"
    :disabled="disabled || loading"
  >
    <div v-if="loading" class="c-btn-loading-overlay"></div>
    <span v-if="$slots.icon" class="c-btn-icon">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { CBtnProps } from "./c-btn.types";

const props = withDefaults(defineProps<CBtnProps>(), {
  icon: undefined,
  to: undefined,
});
const renderer = () => {
  return props.to ? h(RouterLink, { to: props.to }) : h("button");
};
</script>

<style lang="scss">
.c-btn {
  // --background-color: #69b52d;
  // --text-color: white;

  // --hovered-background-color: #45a049;
  // --hovered-text-color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  line-height: 1.25;
  border-radius: 4px;
  padding: 6px 12px;
  text-decoration: none;
  transition-property: background, color;
  transition-duration: 0.4s;
  transition-timing-function: ease;
  overflow: hidden;
  background-color: #4caf50; /* Green */
  color: white;

  &.c-btn--block {
    width: 100%;
  }

  @include md() {
    font-size: 16px;
  }

  &:hover {
    background-color: #45a049; /* Darker Green */
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.is-loading {
    position: relative;
    pointer-events: none;

    .c-btn-loading-overlay {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: inherit;

      &::after {
        --transform-translate: -50%, -50%;
        --size: 12px;
        content: "";
        width: var(--size);
        height: var(--size);
        border: 4px solid transparent;
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
        position: absolute;
        top: 50%;
        left: 50%;
      }
    }
  }

  .c-btn-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 4px;
  }
}
@keyframes button-loading-spinner {
  from {
    transform: translate(var(--transform-translate)) rotate(0turn);
  }

  to {
    transform: translate(var(--transform-translate)) rotate(1turn);
  }
}
</style>
