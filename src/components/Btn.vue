<template>
  <button
    :class="['btn loading-center', { 'btn-disabled': disabled, 'btn-loading': loading }]"
    :disabled="disabled || loading"
  >
    <div v-if="loading" class="btn-loading-overlay"></div>
    <span v-if="icon" class="icon">{{ icon }}</span>
    <div><slot></slot></div>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }>(),
  {},
);
</script>

<style scoped lang="scss">
.btn {
  @apply text-p1;
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 8px 24px;
  text-align: center;
  text-decoration: none;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;

  &:hover {
    background-color: #45a049; /* Darker Green */
  }

  &.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-loading {
    position: relative;
    pointer-events: none;

    .btn-loading-overlay {
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

  .icon {
    margin-right: 5px;
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
