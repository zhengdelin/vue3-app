<script setup lang="ts">
import { $confirm } from "@/composable/useConfirmModal";
import { TabOnBeforeTabChange } from "@/ui/c-tabs-item/c-tabs-item.types";

const tabItems = [
  {
    title: "Tab 1",
    value: "tab1",
  },
  {
    title: "Tab 2",
    value: "tab2",
  },
];

const handleBeforeTabChange: TabOnBeforeTabChange<string> = async (tab) => {
  return new Promise((resolve) => {
    $confirm({
      title: "確認切換",
      content: "是否確認切換到 " + tab,
      onConfirm(close) {
        close();
        resolve(true);
      },
      onCancel() {
        close();
        resolve(false);
      },
    });
  });
};
</script>
<template>
  <div class="flex flex-col gap-4">
    上方的 tabs 也是使用 CTabs 組件，並且開啟了路由設定，試著重整一下，看看 tabs 是否有匹配成功
    <!-- basic usage -->
    <div>
      <div class="demo-section-header">
        <h3 class="demo-section-title">Basic Usage</h3>
      </div>
      <CTabs :items="tabItems">
        <template #page-tab1>
          <div>tab1</div>
        </template>
        <template #page-tab2>
          <div>tab2</div>
        </template>
      </CTabs>
    </div>

    <!-- replace all pages -->
    <div>
      <div class="demo-section-header">
        <h3 class="demo-section-title">All Pages</h3>
      </div>
      <CTabs :items="tabItems" :replace-all-pages="true">
        <template #pages>
          <div>hello</div>
        </template>
      </CTabs>
    </div>

    <!-- route -->
    <div>
      <div class="demo-section-header">
        <h3 class="demo-section-title">Route</h3>
      </div>
      <CTabs :items="tabItems" router>
        <template #page-tab1>
          <div>tab1</div>
        </template>
      </CTabs>
    </div>

    <!-- custom tabs header -->
    <div>
      <div class="demo-section-header">
        <h3 class="demo-section-title">Custom Tabs Header</h3>
      </div>
      <CTabs :items="tabItems">
        <div class="w-full flex justify-between items-center">
          <div class="flex gap-2">
            <template v-for="item in tabItems" :key="item.value">
              <CTabsItem :title="item.title" :value="item.value"></CTabsItem>
            </template>
          </div>
          <div>
            <c-btn>新增</c-btn>
          </div>
        </div>
      </CTabs>
    </div>

    <!-- before tab change -->
    <div>
      <div class="demo-section-header">
        <h3 class="demo-section-title">Before Tab Change</h3>
      </div>
      <CTabs :items="tabItems" @before-tab-change="handleBeforeTabChange">
        <template #page-tab1>
          <div>tab1</div>
        </template>
      </CTabs>
    </div>
  </div>
</template>
<style scoped lang="scss">
.demo-section-header {
  @apply flex justify-between items-center mb-2;
}
.demo-section-title {
  @apply text-h4;
}
</style>
