<template>
  <div class="w-full flex flex-col gap-3 mb-10">
    <!-- 基本使用 -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">基本使用</h3>
    </div>
    <c-table :columns="columns" :data="data"> </c-table>

    <!-- Action Column -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Action Column</h3>
    </div>
    <c-table :columns="[...columns, { type: 'actions' }]" :data="data">
      <template #actions="{ rowIndex }"> Hello this is idx: {{ rowIndex }} </template>
    </c-table>

    <!-- Index Column -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Index Column</h3>
    </div>
    <c-table :columns="[{ type: 'index', label: '#' }, ...columns]" :data="data"> </c-table>

    <!-- column slot -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Column slot</h3>
    </div>
    <c-table :columns="columns" :data="data">
      <template #item-name="{ rowData }"> Hello this is rowData: {{ rowData.id + rowData.name }} </template>
    </c-table>

    <!-- header slot -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Header slot</h3>
    </div>
    <c-table :columns="columns" :data="data">
      <template #item-name-header> Hello this is header </template>
    </c-table>

    <!-- 切換Alignment -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">切換Alignment</h3>
      <div class="flex gap-4">
        <c-btn @click="alignment = 'start'">Start</c-btn>
        <c-btn @click="alignment = 'center'">Center</c-btn>
        <c-btn @click="alignment = 'end'">End</c-btn>
      </div>
    </div>
    <c-table :columns="columns" :data="data" :alignment="alignment">
      <template #item-name="{ rowData }">
        {{ rowData.id + rowData.name }}
      </template>
    </c-table>

    <!-- empty -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Empty</h3>
    </div>
    <c-table :columns="columns" :data="[]">
      <template #empty>
        <div class="py-10 px-4 flex justify-center items-center">沒有東西</div>
      </template>
    </c-table>

    <!-- data table -->
    <div class="flex justify-between items-center">
      <h3 class="text-h4">Data Table</h3>
    </div>
    <c-data-table :columns="columns" :data="data">
      <template #item-name="{ rowData }"> Hello this is rowData: {{ rowData.id + rowData.name }} </template>
    </c-data-table>
  </div>
</template>
<script setup lang="ts">
import { TableColumnAlignment, TableColumns } from "@/ui/c-table/types";
const alignment = ref("start" as TableColumnAlignment);

const columns: TableColumns<(typeof data)[number]> = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "email",
    label: "信箱",
  },
  {
    key: "password",
    label: "密碼",
  },
];

const data = reactive(
  [
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
  ].map((i, idx) => ({ ...i, id: idx })),
);
</script>
<style scoped lang="scss"></style>
