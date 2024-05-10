<template>
  <div :class="['message', `bg-${type}`, `text-${type}`]">
    <template v-if="type === 'success'">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="10.5" fill="white" />
        <path
          d="M19.6758 9.49842C19.5749 9.3927 19.4381 9.33331 19.2955 9.33331C19.1529 9.33331 19.0161 9.3927 18.9152 9.49842L11.6969 17.0633L9.08507 14.3234C8.98257 14.2201 8.84685 14.161 8.70478 14.1578C8.63402 14.157 8.56383 14.1713 8.49847 14.1998C8.43311 14.2282 8.37393 14.2703 8.32449 14.3234C8.22354 14.4292 8.16676 14.5727 8.16663 14.7224C8.16503 14.7967 8.17825 14.8706 8.20543 14.9393C8.23261 15.008 8.27316 15.07 8.32449 15.1213L11.6969 18.6666L19.6758 10.2963C19.7766 10.1905 19.8332 10.047 19.8332 9.89736C19.8332 9.74776 19.7766 9.60427 19.6758 9.49842Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="0.5"
        />
      </svg>
    </template>
    <template v-else-if="type === 'error'">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24.2 21.1522L16.073 6.47204C15.6494 5.70721 14.8746 5.25 14.0001 5.25C13.1255 5.25 12.3507 5.70721 11.9271 6.47204L3.80014 21.1522C3.38912 21.895 3.40067 22.7743 3.83216 23.5055C4.26261 24.2362 5.02586 24.6724 5.87362 24.6724H22.127C22.9743 24.6724 23.7375 24.2362 24.1685 23.5055C24.5989 22.7748 24.611 21.895 24.2 21.1522ZM13.2127 11.8116C13.2127 11.3765 13.5654 11.0242 14.0001 11.0242C14.4347 11.0242 14.7875 11.3765 14.7875 11.8116V17.0609C14.7875 17.4961 14.4347 17.8483 14.0001 17.8483C13.5654 17.8483 13.2127 17.4961 13.2127 17.0609V11.8116ZM14.0001 21.5228C13.42 21.5228 12.9502 21.053 12.9502 20.473C12.9502 19.8929 13.42 19.4231 14.0001 19.4231C14.5801 19.4231 15.0499 19.8929 15.0499 20.473C15.0499 21.053 14.5801 21.5228 14.0001 21.5228Z"
          fill="white"
        />
      </svg>
    </template>
    <template v-else>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="10.5" fill="white" />
        <path
          d="M13.8834 9.33331C13.4487 9.33331 13.096 9.68554 13.096 10.1207V15.37C13.096 15.8052 13.4487 16.1574 13.8834 16.1574C14.318 16.1574 14.6708 15.8052 14.6708 15.37V10.1207C14.6708 9.68554 14.318 9.33331 13.8834 9.33331Z"
          fill="currentColor"
        />
        <path
          d="M12.8335 18.7821C12.8335 19.3621 13.3033 19.8319 13.8834 19.8319C14.4634 19.8319 14.9332 19.3621 14.9332 18.7821C14.9332 18.202 14.4634 17.7322 13.8834 17.7322C13.3033 17.7322 12.8335 18.202 12.8335 18.7821Z"
          fill="currentColor"
        />
      </svg>
    </template>
    <span class="text-p2 text-white">{{ text }}</span>
  </div>
</template>
<script lang="ts" setup>
import { UseMessageConfig } from "../types";

withDefaults(
  defineProps<{
    type: UseMessageConfig["type"];
    text: UseMessageConfig["text"];
  }>(),
  {},
);
</script>
<style lang="scss">
.message {
  @apply flex items-center gap-2 rounded-full whitespace-nowrap;
  padding: 9px 24px 9px 16px;

  min-width: 141px;
  height: 46px;

  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);

  svg {
    --size: 28px;
    width: var(--size);
    height: var(--size);
    @include max-md {
      & {
        --size: 20px;
      }
    }
  }

  @include max-md {
    & {
      min-width: 133px;
      height: 42px;
    }
  }

  &.bg-info {
    background-color: var(--message-bg-info, #3b82f6);
  }

  &.bg-success {
    background-color: var(--message-bg-success, #10b981);
  }

  &.bg-warning {
    background-color: var(--message-bg-warning, #f59e0b);
  }

  &.bg-error {
    background-color: var(--message-bg-error, #ef4444);
  }

  &.text-info {
    color: var(--message-text-info, #000000);
  }

  &.text-success {
    color: var(--message-text-success, #000000);
  }

  &.text-warning {
    color: var(--message-text-warning, #000000);
  }

  &.text-error {
    color: var(--message-text-error, #ffffff);
  }
}
</style>
