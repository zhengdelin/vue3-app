<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <c-text-field
      v-model="data.name"
      label="姓名"
      placeholder="請輸入姓名"
      :error-message="$utils.errorMessages.name[0]"
      size="large"
      auto-focus
    />
    <c-text-field
      v-model="data.email"
      label="信箱"
      placeholder="請輸入信箱"
      :error-message="$utils.errorMessages.email[0]"
      size="medium"
    />
    <c-text-field
      v-model="data.password"
      label="密碼"
      placeholder="請輸入密碼"
      :error-message="$utils.errorMessages.password[0]"
      type="password"
      size="small"
    />

    <c-btn type="submit">提交</c-btn>
  </form>
</template>
<script setup lang="ts">
import { $message } from "@/composable/useMessage";
import { useValidator } from "@/composable/useValidator";

//

const data = reactive({
  name: "",
  email: "",
  password: "",
});

const { $utils } = useValidator(
  [
    { key: "name", rulesDefinition: { required: true } },
    { key: "email", rulesDefinition: { required: true, email: true } },
    { key: "password", rulesDefinition: { required: true, minLength: 8 } },
  ],
  data,
);

const onSubmit = () => {
  $message.success(`提交成功, ${data.email}`);
};
</script>
<style scoped lang="scss"></style>
