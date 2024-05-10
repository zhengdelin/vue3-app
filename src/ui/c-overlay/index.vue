<template>
  <slot name="activator"></slot>
  <Teleport :to="teleportTarget">
    <Transition name="fade" appear>
      <div v-show="isActive" class="overlay" @click.self="onOverlayClick">
        <slot></slot>
      </div>
    </Transition>
  </Teleport>

  <select id="" name=""></select>
  <div class="dropdown"></div>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";
import useToggleClass from "@/composable/useToggleClass";
interface OverlayProps {
  modelValue?: boolean;
  bg?: string;
  teleport?: string;
  closeOnClickOverlay?: boolean;
}
const props = withDefaults(defineProps<OverlayProps>(), {
  modelValue: false,
  bg: "",
  transitionName: "fade",
  teleport: "body",
});
const emit = defineEmits(["update:modelValue"]);

const isActive = useVModel({ props, emit });
useToggleClass(document.body, isActive, "overlay-lock");

const teleportTarget = computed(() => props.teleport);

function onOverlayClick() {
  if (props.closeOnClickOverlay) {
    isActive.value = false;
  }
}
</script>
<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: v-bind("bg");
  z-index: 2000;
  height: var(--100vh, 100vh);
  width: 100%;
  overflow: auto;
  display: flex;
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
