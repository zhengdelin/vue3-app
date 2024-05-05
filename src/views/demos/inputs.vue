<template>
  <div class="container px-4">
    <div class="revert-browser-stylesheets">
      <h1>Samples of Inputs</h1>
      <h2>data</h2>
      <div>{{ data }}</div>
      <!-- text field -->
      <h2>Text Field</h2>
      <div class="grid grid-cols-5 gap-4">
        <div class="">
          <h3>基本使用</h3>
          <InputTextField v-model="data.text" label="文字" placeholder="請輸入文字" required></InputTextField>
        </div>
        <div class="">
          <h3>禁用</h3>
          <InputTextField v-model="data.text" disabled></InputTextField>
        </div>
        <div class="">
          <h3>唯讀</h3>
          <InputTextField v-model="data.text" readonly></InputTextField>
        </div>
        <div class="">
          <h3>關閉清除按鈕</h3>
          <InputTextField v-model="data.text" :clearable="false"></InputTextField>
        </div>
        <div class="">
          <h3>常駐focus</h3>
          <InputTextField
            v-model="data.text"
            always-focus
            label="常駐focus"
            placeholder="此輸入框會常駐focus"
          ></InputTextField>
        </div>
        <div class="">
          <h3>AutoFocus</h3>
          <InputTextField
            v-model="data.text"
            auto-focus
            label="文字"
            placeholder="這個輸入框會在頁面啟動時Focus"
          ></InputTextField>
        </div>
        <div class="">
          <h3>Error</h3>
          <InputTextField v-model="data.text" error error-message="這是錯誤文字"></InputTextField>
        </div>
        <div class="">
          <h3>Debounce 輸入</h3>
          <InputTextField
            v-model="data.text"
            debounce
            label="文字"
            placeholder="這個輸入框會有 debounce 效果"
          ></InputTextField>
        </div>
        <div class="">
          <h3>Prepend Inner Icon</h3>
          <InputTextField v-model="data.text">
            <template #prepend-inner>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
            </template>
          </InputTextField>
        </div>
        <div class="">
          <h3>Append Inner Icon</h3>
          <InputTextField v-model="data.text">
            <template #append-inner>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
            </template>
          </InputTextField>
        </div>
        <div class="">
          <h3>Prepend Icon</h3>
          <InputTextField v-model="data.text">
            <template #prepend>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
            </template>
          </InputTextField>
        </div>
        <div class="">
          <h3>Append Icon</h3>
          <InputTextField v-model="data.text">
            <template #append>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
            </template>
          </InputTextField>
        </div>
        <div class="">
          <h3>size small</h3>
          <InputTextField v-model="data.text" size="small" label="text" placeholder="請輸入文字"> </InputTextField>
        </div>
        <div class="">
          <h3>size medium</h3>
          <InputTextField v-model="data.text" size="medium" label="text" placeholder="請輸入文字"> </InputTextField>
        </div>
        <div class="">
          <h3>size large</h3>
          <InputTextField v-model="data.text" size="large" label="text" placeholder="請輸入文字"> </InputTextField>
        </div>
        <div class="">
          <h3>複製按鈕 Demo</h3>
          <InputTextField v-model="data.text" @click:append-inner="handleCopy">
            <template #append-inner>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16">
                <path
                  d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
                />
              </svg>
            </template>
          </InputTextField>
        </div>
      </div>
      <!-- radio -->
      <h2>Radio</h2>
      <div>
        <h3>基本用法 使用RadioGroup</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="">
            <h4>basic</h4>
            <InputRadioGroup v-model="data.gender">
              <InputRadio :value="Gender.male">男</InputRadio>
              <InputRadio :value="Gender.female">女</InputRadio>
            </InputRadioGroup>
          </div>
          <div class="">
            <h4>Disabled</h4>
            <InputRadioGroup v-model="data.gender" disabled>
              <InputRadio :value="Gender.male">男</InputRadio>
              <InputRadio :value="Gender.female">女</InputRadio>
            </InputRadioGroup>
          </div>
          <div class="">
            <h4>Readonly</h4>
            <InputRadioGroup v-model="data.gender" readonly>
              <InputRadio :value="Gender.male">男</InputRadio>
              <InputRadio :value="Gender.female">女</InputRadio>
            </InputRadioGroup>
          </div>
        </div>
        <h3>不使用RadioGroup</h3>
        <!-- customize your style -->
        <div class="grid grid-cols-4 gap-4">
          <div>
            <h4>basic</h4>
            <div class="p-2 flex gap-2">
              <InputRadio v-model="data.gender" :value="Gender.male">男</InputRadio>
              <InputRadio v-model="data.gender" :value="Gender.female">女</InputRadio>
            </div>
          </div>
          <div>
            <h4>disabled</h4>
            <div class="p-2 flex gap-2">
              <InputRadio v-model="data.gender" :value="Gender.male" disabled>男</InputRadio>
              <InputRadio v-model="data.gender" :value="Gender.female" disabled>女</InputRadio>
            </div>
          </div>
          <div>
            <h4>readonly</h4>
            <div class="p-2 flex gap-2">
              <InputRadio v-model="data.gender" :value="Gender.male" readonly>男</InputRadio>
              <InputRadio v-model="data.gender" :value="Gender.female" readonly>女</InputRadio>
            </div>
          </div>
        </div>
      </div>
      <!-- checkbox -->
      <h2>Checkbox</h2>
      <div>
        <h3>基本用法 使用CheckboxGroup</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <h3>basic</h3>
            <InputCheckboxGroup v-model="data.interests">
              <InputCheckbox value="basketball">籃球</InputCheckbox>
              <InputCheckbox value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox value="tabletennis">桌球</InputCheckbox>
            </InputCheckboxGroup>
          </div>
          <div>
            <h3>disabled</h3>
            <InputCheckboxGroup v-model="data.interests" disabled>
              <InputCheckbox value="basketball">籃球</InputCheckbox>
              <InputCheckbox value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox value="tabletennis">桌球</InputCheckbox>
            </InputCheckboxGroup>
          </div>
          <div>
            <h3>readonly</h3>
            <InputCheckboxGroup v-model="data.interests" readonly>
              <InputCheckbox value="basketball">籃球</InputCheckbox>
              <InputCheckbox value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox value="tabletennis">桌球</InputCheckbox>
            </InputCheckboxGroup>
          </div>
        </div>
        <h3>不使用CheckboxGroup</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <h3>basic</h3>
            <div class="flex flex-col gap-2">
              <InputCheckbox v-model="data.interests" value="basketball">籃球</InputCheckbox>
              <InputCheckbox v-model="data.interests" value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox v-model="data.interests" value="tabletennis">桌球</InputCheckbox>
            </div>
          </div>
          <div>
            <h3>disabled</h3>
            <div class="flex flex-col gap-2">
              <InputCheckbox v-model="data.interests" disabled value="basketball">籃球</InputCheckbox>
              <InputCheckbox v-model="data.interests" disabled value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox v-model="data.interests" disabled value="tabletennis">桌球</InputCheckbox>
            </div>
          </div>
          <div>
            <h3>readonly</h3>
            <div class="flex flex-col gap-2">
              <InputCheckbox v-model="data.interests" readonly value="basketball">籃球</InputCheckbox>
              <InputCheckbox v-model="data.interests" readonly value="badminton">羽毛球</InputCheckbox>
              <InputCheckbox v-model="data.interests" readonly value="tabletennis">桌球</InputCheckbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { $message } from "@/composables/useMessage";

enum Gender {
  male = 0,
  female = 1,
}
const data = reactive({
  text: "",
  gender: Gender.male,
  interests: [],
});

function handleCopy() {
  navigator.clipboard.writeText(data.text);
  $message.success("複製成功");
}
</script>
<style scoped lang="scss"></style>
