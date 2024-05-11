<template>
  <slot
    name="activator"
    is-active="isActive"
    :target-ref="targetRef"
    :props="{ ref: activatorRef as unknown as VNodeRef, ...activatorEvents }"
  ></slot>
  <Teleport :to="teleportTarget">
    <Transition name="fade" appear>
      <div
        v-show="isActive"
        :class="['overlay', { 'is-absolute': absolute }]"
        v-bind="{ ...contentEvents, ...contentProps }"
        @click.self="onOverlayClick"
      >
        <div ref="contentRef" class="overlay--content">
          <slot :is-active="isActive"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- <select id="" name=""></select> -->
  <!-- <div class="dropdown"></div> -->
</template>
<script setup lang="ts">
import { VNodeRef } from "vue";
import { useLocationStrategy } from "./useLocationStrategy";
import { useActivator, ActivatorProps, ACTIVATOR_PROPS_DEFAULT } from "./useActivator";
import { useVModel } from "@/composable/useVModel";
import useToggleClass from "@/composable/useToggleClass";
interface OverlayProps extends ActivatorProps {
  modelValue?: boolean;
  bg?: string;
  teleport?: string;
  closeOnClickOverlay?: boolean;
  absolute?: boolean;

  contentProps?: Record<string, any>;
}
const props = withDefaults(defineProps<OverlayProps>(), {
  modelValue: false,
  bg: "",
  teleport: "body",
  ...(ACTIVATOR_PROPS_DEFAULT as any),
});
const emit = defineEmits(["update:modelValue"]);

// refs
const contentRef = ref<HTMLElement>();

const isActive = useVModel({ props, emit, transformIn: (v) => !!v });
useToggleClass(document.body, isActive, "overlay-lock");

const teleportTarget = computed(() => props.teleport);
const { activatorRef, activatorEl, target, targetEl, targetRef, activatorEvents, contentEvents } = useActivator(props, {
  isActive,
});
useLocationStrategy(props, { target, isActive, contentEl: contentRef });
watchEffect(() => {
  // console.log(target.value);
  // console.log("activatorEvents.value :>> ", activatorEvents.value);
  // console.log("activatorRef.value :>> ", activatorRef.value);
});
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
  &.is-absolute {
    position: absolute;
  }

  .overlay--content {
    outline: none;
    position: absolute;
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
