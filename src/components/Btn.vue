<template>
  <button :class="['btn', { 'btn-disabled': disabled, 'btn-loading': loading }]" :disabled="disabled || loading">
    <span v-if="loading" class="loading-icon">Loading...</span>
    <span v-else-if="icon" class="icon">{{ icon }}</span>
    <span v-else><slot></slot></span>
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
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 8px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049; /* Darker Green */
  }

  &.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-loading {
    pointer-events: none;
  }

  .loading-icon {
    margin-right: 5px;
  }

  .icon {
    margin-right: 5px;
  }
}
</style>
