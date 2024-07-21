<template>
  <div class="container px-4">
    <div class="revert-browser-stylesheets">
      <h2>Position</h2>
      <div>
        <c-radio-group v-model="position" :options="['top', 'bottom', 'start', 'end', 'center']"></c-radio-group>
      </div>
      <h2>Alignment</h2>
      <div><c-radio-group v-model="alignment" :options="['start', 'center', 'end']"></c-radio-group></div>
      <h2>open on click</h2>
      <c-overlay
        absolute
        open-on-click
        location-strategy="connected"
        offset="10px"
        :position="position"
        :alignment="alignment"
      >
        <template #activator="{ props: activatorProps }">
          <c-btn v-bind="activatorProps">切換</c-btn>
        </template>

        <div class="bg-cyan-300 rounded-5 w-20 h-10 flex justify-center items-center">內容</div>
      </c-overlay>
      <h2>open on hover</h2>
      <c-overlay
        absolute
        open-on-hover
        location-strategy="connected"
        offset="10px"
        :position="position"
        :alignment="alignment"
      >
        <template #activator="{ props }">
          <c-btn v-bind="props"> 切換 </c-btn>
        </template>

        <div class="bg-cyan-300 rounded-5 w-20 h-20 flex justify-center items-center">內容</div>
      </c-overlay>
      <h2>open on focus</h2>
      <c-overlay
        absolute
        open-on-focus
        open-on-click
        location-strategy="connected"
        offset="10px"
        :position="position"
        :alignment="alignment"
      >
        <template #activator="{ props }">
          <c-btn v-bind="props"> 切換 </c-btn>
        </template>

        <div class="bg-cyan-300 rounded-5 w-20 h-20 flex justify-center items-center">內容</div>
      </c-overlay>

      <h2>target: cursor</h2>
      <c-overlay
        absolute
        open-on-click
        location-strategy="connected"
        offset="10px"
        :position="position"
        :alignment="alignment"
        target="cursor"
        close-on-content-click
      >
        <template #activator="{ props }">
          <div class="bg-cyan-300 rounded-5 w-[300px] h-[300px] flex justify-center items-center" v-bind="props">
            內容
          </div>
        </template>
        <c-btn> 按鈕 </c-btn>
      </c-overlay>
    </div>
  </div>
</template>
<script setup lang="ts">
const position = ref("top" as any);
const alignment = ref("center" as any);
</script>
<style scoped lang="scss"></style>
