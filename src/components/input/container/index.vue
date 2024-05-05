<template>
  <div
    :class="[
      'input--container',
      size,
      {
        'is-error': isError,
      },
    ]"
    :style="{
      '--input-control-height': height,
      width: width,
    }"
  >
    <div v-if="isPrepended" class="prepend" @click="onPrependClick">
      <slot name="prepend"></slot>
    </div>
    <slot>123</slot>
    <div v-if="isAppended" class="append" @click="onAppendClick">
      <slot name="append"></slot>
    </div>
    <div class="error-messages">
      <!-- <IconExclamationTriangleFill></IconExclamationTriangleFill> -->
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  createEmitEvents,
  INPUT_CONTAINER_PROPS_DEFAULT,
  InputContainerProps,
  InputContainerEmits,
} from "./composables";

const props = withDefaults(defineProps<InputContainerProps>(), INPUT_CONTAINER_PROPS_DEFAULT);
const emit = defineEmits<InputContainerEmits>();
const slots = useSlots();

// areas
const isPrepended = computed(() => !!slots["prepend"]);
const isAppended = computed(() => !!slots["append"]);

const isError = computed(() => props.error || props.errorMessage);

const { "onClick:append": onAppendClick, "onClick:prepend": onPrependClick } = createEmitEvents(emit);
</script>
<style lang="scss">
$error-text-color: rgb(239, 68, 68);
.input--container {
  --error-text-color: #{$error-text-color};

  display: grid;
  grid-template-areas:
    "prepend control append"
    "a messages b";
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  grid-template-rows: auto auto;
  font-size: 1rem;
  line-height: 1.5;

  &.large {
    // --input-container-padding-top: 16px;
    --input-control-height: 64px;
  }

  &.medium {
    // --input-container-padding-top: 16px;
    --input-control-height: 56px;
  }

  &.small {
    // --input-container-padding-top: 16px;
    --input-control-height: 48px;
  }

  .error-messages {
    grid-area: messages;
    font-size: 12px;
    font-weight: 500;
    color: var(--error-text-color);
    display: flex;
    gap: 4px;
    height: 0;
    margin-top: 4px;
    overflow: hidden;
    transition: height 0.2s;
    height: 16px;
    visibility: hidden;
  }

  &.is-error .error-messages {
    // display: flex;
    visibility: visible;
  }

  .prepend,
  .append {
    display: flex;
    align-items: center;
  }

  .prepend {
    grid-area: prepend;
    margin-inline-end: 16px;
  }
  .append {
    grid-area: append;
    margin-inline-start: 16px;
  }
}
</style>
