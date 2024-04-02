<template>
  <span v-html="html"></span>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string | number;
    searchText: string;
    defaultText?: string;
    disabled?: boolean;
    ignorecase?: boolean;
  }>(),
  {
    defaultText: "-",
    disabled: false,
    ignorecase: true,
  },
);

const html = computed(() => {
  const { searchText: _searchText, text } = props;
  if (!_searchText || props.disabled) {
    return text || props.defaultText;
  }

  const _searchTextArr = typeof _searchText === "string" ? [_searchText] : _searchText;

  const searchTextArr = _searchTextArr.map((text) =>
    //替換掉特殊字元 []內表示要替換的字元 ex:(替換為 -> [(]
    text.replace(/([(){}])/g, `[$1]`),
  );

  // console.log("searchTextArr :>> ", searchTextArr);

  const regExpFlag = props.ignorecase ? "gi" : "g";
  const reg = new RegExp(`(${searchTextArr.join("|")})`, regExpFlag);

  // console.log("text, reg :>> ", text, reg);
  return String(text).replace(reg, `<mark>$1</mark>`) || props.defaultText;
});
</script>
<style scoped></style>
