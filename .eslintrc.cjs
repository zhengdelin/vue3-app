/**
 * *vue3提供plugin，支持ts的分析器
 * npm i -D eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser
 *
 * *結合prettier必須安裝
 * npm i -D prettier eslint-plugin-prettier eslint-config-prettier
 * @setting 設定：
 * extends:["prettier"],
 * plugins:["prettier"],
 * rules:{
 *  "prettier/prettier": "error",
 * }
 *
 * 測試eslint用
 * package.json
 * "lint": "eslint ."
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // "plugin:prettier/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vue", "prettier"],
  rules: {
    "vue/multi-word-component-names": 0,
    "prettier/prettier": "error",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    "no-extend-native": ["error", { exceptions: ["Array", "String"] }],
  },
};
