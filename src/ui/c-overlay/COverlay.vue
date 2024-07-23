<template>
  <Teleport v-if="hasContent" :to="teleportTarget" :disabled="!teleportTarget">
    <div v-bind="$attrs" :class="['overlay', { 'is-absolute': absolute }]">
      <Transition name="fade" appear>
        <div v-show="isScrimShow" class="overlay--scrim" :style="scrimStyles" @click.self="onScrimSelfClick"></div>
      </Transition>

      <Transition appear :name="transition" :on-after-leave="onAfterLeave">
        <div v-show="isActive" ref="contentRef" class="overlay--content" v-bind="{ ...contentProps }">
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
import { useLazy } from "../composable/useLazy";
import { OVERLAY_PROPS_DEFAULT } from "./constants";
import { OverlayProps } from "./types";

const props = withDefaults(defineProps<OverlayProps>(), {
  ...OVERLAY_PROPS_DEFAULT,
});

const emit = defineEmits(["update:modelValue", "scrimClick"]);

// refs
const contentRef = ref<HTMLElement>();

const isActive = useVModel({ props, emit, transformIn: (v) => !!v });
const isScrimShow = computed(() => !!props.scrim && isActive.value);
const scrimStyles = computed(() => {
  const bgColor = props.scrim ? (typeof props.scrim === "boolean" ? "var(--overlay-scrim-color)" : props.scrim) : null;
  const styles: Record<string, any> = {};
  if (bgColor) {
    styles["background-color"] = bgColor;
  }
  return styles;
});
// function onClickOutside() {
//   console.log("onClickoutside");
//   if (props.persistent) {
//     return;
//   }
//   isActive.value = false;
// }

// useToggleClass(document.body, isActive, "overlay-lock");
const teleportTarget = computed(() => props.teleport);
const { onAfterLeave: _onAfterLeave, hasContent } = useLazy(props, isActive);

function onAfterLeave() {
  _onAfterLeave();
}

function onScrimSelfClick() {
  emit("scrimClick");
  if (props.persistent) {
    return;
  }
  isActive.value = false;
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

  .overlay--scrim {
    pointer-events: auto;
    border-radius: inherit;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  .overlay--content {
    position: relative;
    pointer-events: auto;
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
