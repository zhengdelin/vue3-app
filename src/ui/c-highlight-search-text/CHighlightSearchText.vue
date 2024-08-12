<template>
  <span v-html="html"></span>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: Maybe<string | number>;
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

const textOrDefault = (text: Maybe<string | number>) => {
  if (typeof text === "number") {
    return text;
  }
  return text || props.defaultText;
};

const html = computed(() => {
  const { searchText: _searchText, text } = props;
  if (!_searchText || props.disabled) {
    return textOrDefault(text);
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
  return textOrDefault(String(text).replace(reg, `<mark>$1</mark>`));
});
</script>
<style scoped></style>
