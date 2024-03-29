<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <InputTextField
      v-model="data.name"
      label="姓名"
      placeholder="請輸入姓名"
      :error-message="$utils.errorMessages.name[0]"
      size="large"
      auto-focus
    />
    <InputTextField
      v-model="data.email"
      label="信箱"
      placeholder="請輸入信箱"
      :error-message="$utils.errorMessages.email[0]"
      size="medium"
    />
    <InputTextField
      v-model="data.password"
      label="密碼"
      placeholder="請輸入密碼"
      :error-message="$utils.errorMessages.password[0]"
      type="password"
      size="small"
    />

    <Btn type="submit">提交</Btn>
  </form>
</template>
<script setup lang="ts">
import { $message } from "@/composables/useMessage";
import { useValidator } from "@/composables/useValidator";

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

const onSubmit = (e: Event) => {
  $message.success(`提交成功, ${data.email}`);
};
</script>
<style scoped lang="scss"></style>
