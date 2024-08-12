<template>
  <c-modal class="confirm-modal" header-class="!py-0" content-class="!pb-6" footer-class="!py-0" hide-close>
    <template #header>
      <div class="confirm-modal__header">
        <component :is="renderIcon"></component>
        <h5 class="text-h5 font-bold">{{ title }}</h5>
      </div>
    </template>
    <div class="confirm-modal__content">
      <slot>
        <div class="text" v-html="text"></div>
      </slot>
    </div>
    <template #footer="{ confirm, cancel, confirmBtnProps, cancelBtnProps }">
      <n-button v-bind="cancelBtnProps" @click="cancel">取消</n-button>
      <n-button type="primary" attr-type="submit" v-bind="confirmBtnProps" @click="confirm">確定</n-button>
    </template>
  </c-modal>
</template>
<script setup lang="tsx">
import { ConfirmModalProps } from "@/composable/useConfirmModal";

const props = withDefaults(
  defineProps<{
    type?: ConfirmModalProps["type"];
    title: string;
    text?: string;
  }>(),
  {
    type: "warning",
    text: "",
  },
);

const renderIcon = () => {
  switch (props.type) {
    case "warning":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22 12C22 17.5241 17.5225 22 12 22C6.47754 22 2 17.5241 2 12C2 6.47915 6.47754 2 12 2C17.5225 2 22 6.47915 22 12ZM12 14.0161C10.9756 14.0161 10.1452 14.8466 10.1452 15.871C10.1452 16.8954 10.9756 17.7258 12 17.7258C13.0244 17.7258 13.8548 16.8954 13.8548 15.871C13.8548 14.8466 13.0244 14.0161 12 14.0161ZM10.5381 12.8328L10.239 7.34895C10.2239 7.07177 10.4445 6.83871 10.7221 6.83871H13.2779C13.5554 6.83871 13.7761 7.07177 13.761 7.34895L13.4619 12.8328C13.4479 13.0894 13.2357 13.2903 12.9788 13.2903H11.0212C10.7643 13.2903 10.5521 13.0894 10.5381 12.8328Z"
            fill="#FDB531"
          />
        </svg>
      );
    case "info":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="21" fill="#2196f3" />
          <path fill="#fff" d="M22 22h4v11h-4z" />
          <circle cx="24" cy="16.5" r="2.5" fill="#fff" />
        </svg>
      );
    case "error":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
          <path fill="red" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M9 5v6h2V5zm0 8v2h2v-2z" />
        </svg>
      );
    default:
      return "";
  }
};
</script>
<style lang="scss">
.confirm-modal {
  max-width: 400px;
  --padding-top: 32px;
  --padding-left: 32px;
  --padding-right: 32px;
  --padding-bottom: 24px;
  --gap: 16px;
  --icon-size: 24px;
  &__header {
    @apply flex items-center;
    gap: var(--gap);
    svg {
      width: var(--icon-size);
      height: var(--icon-size);
    }
  }

  &__content {
    .text {
      @apply text-p2 whitespace-pre-wrap;
      padding-left: calc(var(--gap) + var(--icon-size));
    }
  }
}
</style>
