<template>
  <c-overlay
    v-model="modelV"
    :class="['modal-overlay', `modal--position-${position}`, { 'is-drawer': isDrawer, 'is-full-screen': isFullScreen }]"
    :scrim="true"
    :persistent="true"
    :style="{
      '--c-modal-slide-transform': transform,
    }"
    :transition="transition"
    @scrim-click="handleOnOverlayClick"
  >
    <component
      :is="component"
      v-slot="form"
      :class="['modal', { 'scroll-body': scrollBody, 'is-drawer': isDrawer, 'is-full-screen': isFullScreen }]"
      v-bind="$attrs"
    >
      <div v-if="!hideHeader" :class="['modal__header', headerClass]">
        <div class="wrapper">
          <slot name="header" :close="closeModal">
            <h4 :class="['text-h5 truncate', titleClass]">{{ title }}</h4>
          </slot>
          <div v-if="!hideClose && !closeBtnOutside" class="close-btn" @click.stop="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
                d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        v-if="!hideClose && closeBtnOutside"
        :class="['close-btn', { 'is-outside': closeBtnOutside }]"
        @click.stop="closeModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
          />
        </svg>
      </div>

      <div :class="['modal__content', contentClass]">
        <slot :close="closeModal"></slot>
      </div>

      <div v-if="!hideFooter" :class="['modal__footer', footerClass]">
        <slot name="footer" v-bind="footerSlotProps(!!form?.disabled)">
          <slot name="footer-prepend" v-bind="footerSlotProps(!!form?.disabled)"></slot>
          <c-btn v-bind="cancelBtnProps" @click="onCancel">
            {{ cancelText }}
          </c-btn>
          <c-btn type="submit" :disabled="form?.disabled" v-bind="confirmBtnProps" @click="onConfirm">
            {{ confirmText }}
          </c-btn>
          <slot name="footer-append" v-bind="footerSlotProps(!!form?.disabled)"></slot>
        </slot>
      </div>
    </component>
  </c-overlay>
</template>

<script setup lang="ts">
// import FormContainer from "@/components/form/Container.vue";
import { $confirm } from "@/composable/useConfirmModal";
import { useVDeepModel } from "@/composable/useVModel";

import useDefaultValue from "@/composable/useDefaultValue";
import { useI18n } from "@/composable/useI18n";
import { VNode } from "vue";

type Position = "center" | "right" | "left" | "top" | "bottom";
interface Modal {
  modelValue?: boolean;
  title?: string;
  titleClass?: string;

  /**
   * 若為Drawer 會預設不顯示關閉按鈕
   */
  hideClose?: boolean;
  closeBtnOutside?: boolean;
  /**
   * 點擊外圍overlay時是否關閉
   * @default closeWhenFormModelChanged // 當formModel有值時的預設
   * @default close
   *
   * @when false // 甚麼都不做
   * @when close // 關閉彈窗
   * @when closeWhenFormModelChanged // 視formModel有無修改過而決定
   * @when Function // 回傳true關閉
   */
  onOverlayClick?: false | "close" | "closeWhenFormModelChanged" | (() => MaybePromise<boolean>);

  hideHeader?: boolean;
  hideFooter?: boolean;

  footerClass?: string;
  headerClass?: string;
  contentClass?: string;

  cancelText?: string;
  cancelBtnProps?: object;
  confirmBtnProps?: object;
  confirmText?: string;

  /**
   * 若為drawer 會自動為true
   */
  scrollBody?: boolean;
  position?: Position;
  fullScreen?: boolean;

  /**
   * 綁定在formContainer上的modalValue
   */
  formModel?: any;
  renderModalComponent?: () => VNode;
}

const TRANSFORM_MAP: Record<Exclude<Position, "">, string> = {
  center: "",
  right: "translateX(100%)",
  left: "translateX(-100%)",
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
};

const props = withDefaults(defineProps<Modal>(), {
  hideClose: undefined,
  cancelText: "取消",
  confirmText: "確定",
  confirmDisabled: undefined,
  onOverlayClick: undefined,

  // onClose() {},
  // onConfirm() {},
  // onCancel() {},

  modelValue: true,
  position: "center",

  scrollBody: undefined,
  fullScreen: false,
  renderModalComponent: undefined,
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel", "close"]);

// formModel
const formModel = useVDeepModel({
  props,
  propName: "formModel",
  emit,
});
const isFormModelPassed = computed(() => props.formModel !== undefined);
const { refreshDefault: refreshDefaultFormModel, isValueChanged: isFormModelChanged } = useDefaultValue(formModel);

/**
 * 要渲染的容器
 */
const component = computed(() => props.renderModalComponent?.() || h("div"));

// modal屬性
const scrollBody = computed(() => props.scrollBody ?? isDrawer.value);
const isFullScreen = computed(() => props.fullScreen);
const position = computed(() => (isFullScreen.value ? "bottom" : props.position));
const isDrawer = computed(() => position.value !== "center");
const hideClose = computed(() => props.hideClose ?? (isFullScreen.value ? false : isDrawer.value));
// modal動畫屬性
const transform = computed(() => TRANSFORM_MAP[position.value]);
const transition = computed(() => (isDrawer.value || isFullScreen.value ? "c-modal-slide" : "c-modal"));
// const transitionClasses = computed(() => {
//   if (isDrawer.value || isFullScreen.value) {
//     return {
//       enterFrom: "slide-enter-from",
//       enterTo: "slide-enter-to",
//       leaveFrom: "slide-leave-from",
//       leaveTo: "slide-leave-to",
//     };
//   }
//   return {
//     enterFrom: "modal-enter-from",
//     enterTo: "modal-enter-to",
//     leaveFrom: "modal-leave-from",
//     leaveTo: "modal-leave-to",
//   };
// });

// modal顯示
const modelV = computed({
  get: () => props.modelValue,
  set: (v) => {
    if (v === props.modelValue) return;
    // 將值傳給外層 透過外層決定要銷毀還是隱藏
    if (v) emit("update:modelValue", v);
    else closeModal();
  },
});

// modal emit函數
function closeModal() {
  // console.log('emit("close");');
  emit("update:modelValue", false);
  emit("close");
}
function onConfirm() {
  // console.log('emit("confirm");');
  emit("confirm", closeModal);
}
function onCancel() {
  // console.log('emit("cancel");');
  emit("cancel", closeModal);
}

// 彈出的關閉確認框
const { $tt } = useI18n();
const confirmModal = $confirm(
  {
    title: $tt.s("youHaveUnsavedChanges"),
    text: `如果您關閉此頁面，您未保存的資料將會遺失。\n您確定要離開此頁面嗎？`,
    onConfirm: (close) => {
      close();
      closeModal();
    },
    confirmText: $tt("leave"),
    cancelText: $tt("stay"),
  },
  false,
  false,
);
onUnmounted(() => {
  confirmModal.destroy();
});

// 當點擊到黑邊
// const isFormModelChanged = computed(() => Object.isEqual(formModel.value, defaultFormModel.value));
const onOverlayClickAction = computed(() => {
  let { onOverlayClick } = props;
  if (onOverlayClick === undefined) {
    if (isFormModelPassed.value) {
      onOverlayClick = "closeWhenFormModelChanged";
    } else return "close";
  }
  if (onOverlayClick === "closeWhenFormModelChanged") {
    return isFormModelChanged.value ? "showConfirmModal" : "close";
  }
  return onOverlayClick;
});

async function handleOnOverlayClick() {
  const action = onOverlayClickAction.value;
  if (action === false) return;

  if (action === "close") {
    return closeModal();
  }

  if (action === "showConfirmModal") {
    return confirmModal.show();
  }

  if (await action()) {
    closeModal();
  }
}

const footerSlotProps = (disabled: boolean) => ({
  close: closeModal,
  disabled,
  confirm: onConfirm,
  cancel: onCancel,
  confirmBtnProps: props.confirmBtnProps,
  cancelBtnProps: props.cancelBtnProps,
});

defineExpose({
  /**
   * 刷新formModel 使點擊overlay後關閉modal
   */
  refreshDefaultFormModel,
  confirmModal,
});
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<style lang="scss">
.modal-overlay {
  padding: 5vh 1rem;
  &.is-drawer,
  &.is-full-screen {
    padding: 0;
  }

  .overlay--content {
    display: flex;
  }
}

.modal--position-left .overlay--content {
  margin-right: auto;
}
.modal--position-right .overlay--content {
  margin-left: auto;
}
.modal--position-left,
.modal--position-right {
  .modal {
    width: 450px;
  }
}

.modal--position-bottom,
.modal--position-top {
  .modal {
    height: 450px;
    max-width: 100%;
  }
}
.modal--position-bottom {
  .overlay--content {
    margin-top: auto;
  }
}

.modal--position-top {
  .overlay--content {
    margin-bottom: auto;
  }
}

.modal--position-center {
  // 利用margin平均分配上下左右剩餘空間
  .overlay--content {
    margin: auto;
  }
}

.modal {
  --padding-top: 20px;
  --padding-bottom: 20px;
  --padding-left: 24px;
  --padding-right: 24px;
  @apply relative flex flex-col rounded-4 w-auto md:w-fit md:min-w-[450px];
  padding-top: var(--padding-top);
  padding-bottom: var(--padding-bottom);
  background-color: rgb(255, 255, 255);

  &__footer,
  &__header,
  &__content {
    padding-left: var(--padding-left);
    padding-right: var(--padding-right);
  }

  .close-btn {
    cursor: pointer;
    position: absolute;
    width: var(--size);
    height: var(--size);
    &.is-outside {
      --size: 32px;
      font-size: 28px;
      top: 0;
      right: calc(-1 * var(--size) - 1.5rem);
      color: rgb(var(--v-theme-white));
    }
  }

  &__header {
    @apply pb-4;
    .wrapper {
      @apply relative;
      --close-btn-size: 20px;
      padding-right: var(--close-btn-size);
      .close-btn {
        --size: var(--close-btn-size);
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        color: rgb(var(--v-theme-sec-grey));
      }
    }
  }

  &__content {
    @apply overflow-auto;
  }

  &__footer {
    @apply flex justify-end gap-4 pt-4;
  }

  &.is-drawer,
  &.is-full-screen {
    border-radius: 0;
  }

  &.is-drawer & {
    &__content {
      @apply flex-1;
    }
    &__footer {
      @apply border-t;
    }
  }

  &.is-full-screen {
    width: 100vw;
    height: var(--100vh, 100vh);
  }

  &.scroll-body {
    max-height: 100%;
  }
}
</style>
<style lang="scss">
.c-modal-enter-active,
.c-modal-slide-enter-active {
  transition: all 0.35s ease-out;
}
.c-modal-leave-active,
.c-modal-slide-leave-active {
  transition: all 0.2s linear;
}

.c-modal-enter-from,
.c-modal-leave-to {
  opacity: 0;
  transform: translateY(3%);
}
.c-modal-enter-to,
.c-modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.c-modal-slide-enter-from,
.c-modal-slide-leave-to {
  transform: var(--c-modal-slide-transform);
}
.c-modal-slide-enter-to,
.c-modal-slide-leave-from {
  transform: translateX(0) translateY(0);
}
</style>
