<template>
  <Modal class="confirm-modal" :show-close="false" header-class="!py-0" content-class="!pb-6" footer-class="!py-0" hide-close>
    <template #header>
      <div class="confirm-modal__header">
        <template v-if="type === 'warning'">
          <svg :width="24" :height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 12C22 17.5241 17.5225 22 12 22C6.47754 22 2 17.5241 2 12C2 6.47915 6.47754 2 12 2C17.5225 2 22 6.47915 22 12ZM12 14.0161C10.9756 14.0161 10.1452 14.8466 10.1452 15.871C10.1452 16.8954 10.9756 17.7258 12 17.7258C13.0244 17.7258 13.8548 16.8954 13.8548 15.871C13.8548 14.8466 13.0244 14.0161 12 14.0161ZM10.5381 12.8328L10.239 7.34895C10.2239 7.07177 10.4445 6.83871 10.7221 6.83871H13.2779C13.5554 6.83871 13.7761 7.07177 13.761 7.34895L13.4619 12.8328C13.4479 13.0894 13.2357 13.2903 12.9788 13.2903H11.0212C10.7643 13.2903 10.5521 13.0894 10.5381 12.8328Z"
              fill="#FDB531"
            />
          </svg>
        </template>
        <h5 class="text-h5 font-bold">{{ title }}</h5>
      </div>
    </template>
    <div class="confirm-modal__content" v-html="text"></div>
    <template #footer="{ confirm, cancel, confirmBtnProps, cancelBtnProps }">
      <Btn v-bind="cancelBtnProps" @click="cancel">取消</Btn>
      <Btn type="submit" v-bind="confirmBtnProps" @click="confirm">確定</Btn>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ConfirmModalProps } from "@/composables/useConfirmModal";

withDefaults(
  defineProps<{
    type?: ConfirmModalProps["type"];
    title: string;
    text: string;
  }>(),
  {
    type: "warning",
  },
);
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
    @apply text-p2 whitespace-pre-wrap;
    padding-left: calc(var(--gap) + var(--icon-size));
  }
}
</style>
