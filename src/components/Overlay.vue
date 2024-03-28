<template>
  <Transition name="fade" appear>
    <div v-show="modelValue" class="overlay">
      <slot></slot>
    </div>
  </Transition>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: boolean; bg?: string }>(), {
  bg: "rgba(0, 0, 0, 0.2)",
  transitionName: "fade",
});

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      addBodyOverflowHidden();
    } else {
      removeBodyOverflowHidden();
    }
  },
);

function removeBodyOverflowHidden() {
  document.body.classList.remove("overlay-lock");
}
function addBodyOverflowHidden() {
  document.body.classList.add("overlay-lock");
}

onMounted(addBodyOverflowHidden);
onUnmounted(removeBodyOverflowHidden);
</script>
<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: v-bind("bg");
  z-index: 2000;
  height: 100vh;
  width: 100%;
  overflow: auto;
  display: flex;
}
.overlay-lock {
  @apply overflow-hidden h-screen;
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
