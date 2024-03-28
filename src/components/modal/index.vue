<template>
  <Overlay :model-value="modelValue" />
  <Transition
    :enter-from-class="transitionClasses.enterFrom"
    :enter-to-class="transitionClasses.enterTo"
    :leave-from-class="transitionClasses.leaveFrom"
    :leave-to-class="transitionClasses.leaveTo"
    appear
  >
    <Overlay
      :class="['modal-overlay', { 'is-drawer': isDrawer, 'is-full-screen': isFullScreen }]"
      :model-value="modelV"
      bg="transparent"
      @click.self="onOverlayClick"
    >
      <component
        :is="component"
        v-slot="form"
        :class="['modal', `modal--position-${position}`, { 'scroll-body': scrollBody, 'is-drawer': isDrawer, 'is-full-screen': isFullScreen }]"
        v-bind="$attrs"
      >
        <div v-if="!hideHeader" :class="['modal__header', headerClass]">
          <div class="wrapper">
            <slot name="header" :close="closeModal">
              <h4 :class="['text-h5 truncate', titleClass]">{{ title }}</h4>
            </slot>
            <button
              v-if="!hideClose && !closeBtnOutside"
              class="close-btn"
              density="comfortable"
              variant="text"
              icon="mdi-close"
              @click.stop="closeModal"
            ></button>
          </div>
        </div>
        <Btn
          v-if="!hideClose && closeBtnOutside"
          :class="['close-btn', { 'is-outside': closeBtnOutside }]"
          icon="mdi-close"
          @click.stop="closeModal"
        ></Btn>

        <div :class="['modal__content', contentClass]">
          <slot :close="closeModal"></slot>
        </div>

        <div v-if="!hideFooter" :class="['modal__footer', footerClass]">
          <slot name="footer" v-bind="footerSlotProps(!!form?.disabled)">
            <slot name="footer-prepend" v-bind="footerSlotProps(!!form?.disabled)"></slot>
            <Btn v-bind="cancelBtnProps" @click="onCancel">
              {{ cancelText }}
            </Btn>
            <Btn type="submit" :disabled="form?.disabled" v-bind="confirmBtnProps" @click="onConfirm">
              {{ confirmText }}
            </Btn>
            <slot name="footer-append" v-bind="footerSlotProps(!!form?.disabled)"></slot>
          </slot>
        </div>
      </component>
    </Overlay>
  </Transition>
</template>

<script setup lang="ts">
// import FormContainer from "@/components/form/Container.vue";
import { $confirm } from "@/composables/useConfirmModal";
import { useVDeepModel, checkPropIsPassed } from "@/composables/useVModel";

import useDefaultValue from "@/composables/useDefaultValue";
import { useI18n } from "@/composables/useI18n";

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
   * 若綁定formModel 會自動變為true
   */
  asForm?: boolean;
  /**
   * 綁定在formContainer上的modalValue
   */
  formModel?: any;
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
  asForm: undefined,
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel", "close"]);

// formModel
const formModel = useVDeepModel({
  props,
  propName: "formModel",
  emit,
});
const isFormModelPassed = checkPropIsPassed({
  props,
  propName: "formModel",
});
const { refreshDefault: refreshDefaultFormModel, isValueChanged: isFormModelChanged } = useDefaultValue(formModel);
const asForm = computed(() => props.asForm ?? isFormModelPassed.value);

/**
 * 要渲染的容器
 */
const component = computed(() => (asForm.value ? h("form") : h("div")));

// modal屬性
const scrollBody = computed(() => props.scrollBody ?? isDrawer.value);
const isFullScreen = computed(() => props.fullScreen);
const position = computed(() => (isFullScreen.value ? "bottom" : props.position));
const isDrawer = computed(() => position.value !== "center");
const hideClose = computed(() => props.hideClose ?? (isFullScreen.value ? false : isDrawer.value));
// modal動畫屬性
const transform = computed(() => TRANSFORM_MAP[position.value]);
const transitionClasses = computed(() => {
  if (isDrawer.value || isFullScreen.value) {
    return {
      enterFrom: "slide-enter-from",
      enterTo: "slide-enter-to",
      leaveFrom: "slide-leave-from",
      leaveTo: "slide-leave-to",
    };
  }
  return {
    enterFrom: "modal-enter-from",
    enterTo: "modal-enter-to",
    leaveFrom: "modal-leave-from",
    leaveTo: "modal-leave-to",
  };
});

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

async function onOverlayClick() {
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

  &--position-left {
    margin-right: auto;
  }
  &--position-right {
    margin-left: auto;
  }
  &--position-left,
  &--position-right {
    width: 450px;
  }

  &--position-bottom,
  &--position-top {
    height: 450px;
    max-width: 100%;
  }
  &--position-bottom {
    margin-top: auto;
  }

  &--position-top {
    margin-bottom: auto;
  }

  &--position-center {
    // 利用margin平均分配上下左右剩餘空間
    margin: auto;
  }

  &__footer,
  &__header,
  &__content {
    padding-left: var(--padding-left);
    padding-right: var(--padding-right);
  }

  .close-btn {
    position: absolute;
    width: var(--size);
    height: var(--size);
    &.is-outside {
      --size: 40px;
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
      --close-btn-size: 32px;
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
      @apply border-t border-v;
    }
  }

  &.is-full-screen {
    width: 100%;
    height: 100%;
  }

  &.scroll-body {
    max-height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.v-enter-active {
  transition: all 0.35s ease-out;
}
.v-leave-active {
  transition: all 0.2s linear;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(3%);
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-enter-from,
.slide-leave-to {
  transform: v-bind("transform");
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0) translateY(0);
}
</style>
