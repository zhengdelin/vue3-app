<template>
  <RouterView>
    <template #default="{ Component }">
      <Suspense :timeout="0">
        <component :is="Component"></component>
        <template #fallback>
          <Loading />
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>

<script setup lang="ts"></script>

<style scoped></style>
