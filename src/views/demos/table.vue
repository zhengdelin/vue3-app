<template>
  <div class="w-full flex flex-col gap-3 mb-10">
    <div class="flex justify-between items-center">
      <h1 class="text-h2">切換Alignment</h1>
      <div class="flex gap-4">
        <Btn @click="alignment = 'start'">Start</Btn>
        <Btn @click="alignment = 'center'">Center</Btn>
        <Btn @click="alignment = 'end'">End</Btn>
      </div>
    </div>
    <TableContainer
      :columns="columns"
      :data-source="data"
      :column-alignment="alignment"
      :show-action="false"
      :show-search="false"
    ></TableContainer>
    <div class="flex justify-between items-center">
      <h1 class="text-h2">搜尋</h1>
      <div class="flex gap-4">
        <Btn @click="searchConfig.show = !searchConfig.show">{{ searchConfig.show ? "隱藏" : "顯示" }}</Btn>
        <Btn @click="searchConfig.ignoreCase = !searchConfig.ignoreCase">{{
          searchConfig.ignoreCase ? "不忽略大小寫" : "忽略大小寫"
        }}</Btn>
      </div>
    </div>
    <TableContainer
      :columns="columns"
      :data-source="data"
      :show-action="false"
      :show-search="searchConfig.show"
      :search-config="{ ignoreCase: searchConfig.ignoreCase }"
    >
      <template #extra> this is extra slot </template>
    </TableContainer>
  </div>
</template>
<script setup lang="ts">
import TableContainer from "@/components/TableContainer/index.vue";
import type { ColumnOptions, TableColumnAlignment } from "@/components/TableContainer/types";
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
