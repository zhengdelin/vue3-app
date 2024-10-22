<script setup lang="ts">
const showRoutes = [
  {
    title: "Tab",
    path: "/demo/tabs",
    route: "/demo/tabs",
  },
  {
    title: "Modal",
    path: "/demo/modal",
    route: "/demo/modal",
  },
  {
    title: "ConfirmModal",
    path: "/demo/confirm-modal",
    route: "/demo/confirm-modal",
  },
  {
    title: "Message",
    path: "/demo/message",
    route: "/demo/message",
  },
  {
    title: "Table",
    path: "/demo/table",
    route: "/demo/table",
  },
];
</script>
<template>
  <div>
    <CTabs sticky :items="showRoutes" item-value-key="path">
      <template #pages>
        <div class="p-4">
          <router-view></router-view>
        </div>
      </template>
    </CTabs>
  </div>
</template>
<style scoped lang="scss"></style>
