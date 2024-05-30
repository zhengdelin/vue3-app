<template>
  <slot
    name="activator"
    :is-active="isActive"
    :target-ref="targetRef"
    :props="{ ref: activatorRef as unknown as VNodeRef, ...activatorEvents }"
  ></slot>
  <Teleport v-if="hasContent" :to="teleportTarget" :disabled="!teleportTarget">
    <div v-bind="$attrs" :class="['overlay', { 'is-absolute': absolute }]">
      <Transition name="fade" appear>
        <div v-if="isScrimShow" class="overlay--scrim" :style="scrimStyles" v-bind="scrimEvents"></div>
      </Transition>

      <Transition appear :name="transition" :on-after-leave="onAfterLeave">
        <div
          v-show="isActive"
          ref="contentRef"
          v-click-outside="{ handler: onClickOutside, include: () => [activatorEl] }"
          class="overlay--content"
          v-bind="{ ...contentEvents, ...contentProps }"
          :style="contentStyles"
        >
          <slot :is-active="isActive"></slot>
        </div>
      </Transition>
    </div>
  </Teleport>

  <!-- <select id="" name=""></select> -->
  <!-- <div class="dropdown"></div> -->
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import { VNodeRef } from "vue";
import { LazyProps, useLazy } from "../composable/useLazy";
import { ACTIVATOR_PROPS_DEFAULT, ActivatorProps, useActivator } from "./useActivator";
import { LOCATION_STRATEGY_PROPS_DEFAULT, LocationStrategyProps, useLocationStrategy } from "./useLocationStrategy";
interface OverlayProps extends ActivatorProps, LocationStrategyProps, LazyProps {
  modelValue?: boolean;
  scrim?: boolean | string;
  teleport?: string;
  absolute?: boolean;

  /**
   * 持久化
   * 為 true 時 click outside 時將不會關閉
   */
  persistent?: boolean;

  contentProps?: Record<string, any>;

  // transition
  transition?: string;
}

const props = withDefaults(defineProps<OverlayProps>(), {
  ...ACTIVATOR_PROPS_DEFAULT,
  ...LOCATION_STRATEGY_PROPS_DEFAULT,
  modelValue: false,
  scrim: false,
  teleport: "body",
  transition: "fade",
});

console.log("props :>> ", props);

const emit = defineEmits(["update:modelValue"]);

// refs
const contentRef = ref<HTMLElement>();

const isActive = useVModel({ props, emit, transformIn: (v) => !!v });
const isScrimShow = computed(() => isActive.value && !!props.scrim);
const scrimStyles = computed(() => {
  const bgColor = props.scrim ? (typeof props.scrim === "boolean" ? "var(--overlay-scrim-color)" : props.scrim) : null;
  const styles: Record<string, any> = {};
  if (bgColor) {
    styles["background-color"] = bgColor;
  }
  return styles;
});
function onClickOutside() {
  if (props.persistent) {
    return;
  }
  isActive.value = false;
}

// useToggleClass(document.body, isActive, "overlay-lock");
const teleportTarget = computed(() => props.teleport);
const { onAfterLeave: _onAfterLeave, hasContent } = useLazy(props, isActive);
const { activatorRef, activatorEl, target, targetRef, activatorEvents, contentEvents, scrimEvents } = useActivator(
  props,
  {
    isActive,
  },
);
const { contentStyles } = useLocationStrategy(props, { target, isActive, contentEl: contentRef });

function onAfterLeave() {
  _onAfterLeave();
}
</script>
<style lang="scss">
.overlay {
  --overlay-scrim-color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  &.is-absolute {
    position: absolute;
  }

  .overlay--content {
    outline: none;
    position: absolute;
    pointer-events: auto;
  }

  .overlay--scrim {
    pointer-events: auto;
    border-radius: inherit;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  .open-on-hover {
  }
}
.overlay-lock {
  overflow: hidden;
  height: var(--100vh, 100vh);
}
</style>
<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.35s ease-out;
}
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
