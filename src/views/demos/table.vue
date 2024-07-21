<template>
  <div class="w-full flex flex-col gap-3 mb-10">
    <div class="flex justify-between items-center">
      <h1 class="text-h2">切換Alignment</h1>
      <div class="flex gap-4">
        <c-btn @click="alignment = 'start'">Start</c-btn>
        <c-btn @click="alignment = 'center'">Center</c-btn>
        <c-btn @click="alignment = 'end'">End</c-btn>
      </div>
    </div>
    <c-table
      :columns="columns"
      :data-source="data"
      :column-alignment="alignment"
      :show-action="false"
      :show-search="false"
    >
    </c-table>
    <div class="flex justify-between items-center">
      <h1 class="text-h2">搜尋</h1>
      <div class="flex gap-4">
        <c-btn @click="searchConfig.show = !searchConfig.show">{{ searchConfig.show ? "隱藏" : "顯示" }}</c-btn>
        <c-btn @click="searchConfig.ignoreCase = !searchConfig.ignoreCase">{{
          searchConfig.ignoreCase ? "不忽略大小寫" : "忽略大小寫"
        }}</c-btn>
      </div>
    </div>
    <c-table
      :columns="columns"
      :data-source="data"
      :show-action="false"
      :show-search="searchConfig.show"
      :search-config="{ ignoreCase: searchConfig.ignoreCase }"
    >
      <template #extra> this is extra slot </template>
    </c-table>
  </div>
</template>
<script setup lang="ts">
import type { ColumnOptions, TableColumnAlignment } from "@/ui/c-table/types";
const alignment = ref("start" as TableColumnAlignment);
const searchConfig = reactive({
  show: true,
  ignoreCase: true,
});

const columns: ColumnOptions[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "姓名",
    search: true,
  },
  {
    key: "email",
    label: "信箱",
    search: true,
  },
  {
    key: "password",
    label: "密碼",
    search: true,
  },
];

const data = reactive([
  {
    id: 1,
    name: "John",
    email: "john@me.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@me.com",
    password: "123456",
  },
  {
    id: 3,
    name: "Jack",
    email: "jack@me.com",
    password: "123456",
  },
  {
    id: 4,
    name: "Jill",
    email: "jill@me.com",
    password: "123456",
  },
  {
    id: 5,
    name: "Jim",
    email: "jim@me.com",
    password: "123456",
  },
  {
    id: 6,
    name: "Jen",
    email: "jen@me.com",
    password: "123456",
  },
  {
    id: 1,
    name: "John",
    email: "john@me.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@me.com",
    password: "123456",
  },
  {
    id: 3,
    name: "Jack",
    email: "jack@me.com",
    password: "123456",
  },
  {
    id: 4,
    name: "Jill",
    email: "jill@me.com",
    password: "123456",
  },
  {
    id: 5,
    name: "Jim",
    email: "jim@me.com",
    password: "123456",
  },
  {
    id: 6,
    name: "Jen",
    email: "jen@me.com",
    password: "123456",
  },
  {
    id: 1,
    name: "John",
    email: "john@me.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@me.com",
    password: "123456",
  },
  {
    id: 3,
    name: "Jack",
    email: "jack@me.com",
    password: "123456",
  },
  {
    id: 4,
    name: "Jill",
    email: "jill@me.com",
    password: "123456",
  },
  {
    id: 5,
    name: "Jim",
    email: "jim@me.com",
    password: "123456",
  },
  {
    id: 6,
    name: "Jen",
    email: "jen@me.com",
    password: "123456",
  },
  {
    id: 1,
    name: "John",
    email: "john@me.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@me.com",
    password: "123456",
  },
  {
    id: 3,
    name: "Jack",
    email: "jack@me.com",
    password: "123456",
  },
  {
    id: 4,
    name: "Jill",
    email: "jill@me.com",
    password: "123456",
  },
  {
    id: 5,
    name: "Jim",
    email: "jim@me.com",
    password: "123456",
  },
  {
    id: 6,
    name: "Jen",
    email: "jen@me.com",
    password: "123456",
  },
]);
</script>
<style scoped lang="scss"></style>
