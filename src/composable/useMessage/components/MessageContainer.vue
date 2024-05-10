<template>
  <TransitionGroup tag="div" class="message-container">
    <Message v-for="item in messages" :key="item.id" :type="item.type" :text="item.text"></Message>
  </TransitionGroup>
</template>
<script lang="ts" setup>
import { messages } from "../message";
import Message from "./Message.vue";
</script>
<style lang="scss">
.message-container {
  z-index: 9999;
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.v-enter-active,
.v-move,
.v-leave-active {
  transition: all 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.v-leave-active {
  position: absolute;
}
</style>
