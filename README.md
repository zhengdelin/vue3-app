# Vite - Vue 3 專案 Sample

包含
- TypeScript
- unplugin-auto-import
- Pinia
- TailwindCSS
- scss(sass)
- Eslint
- Prettier
- axios
- autoGenerateRoutes
- Dockerfile 部署

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)

## 專案啟動
```bash
npm run install # 安裝依賴
npm run dev # 啟動開發環境
```

## 安裝 scss
[官方文檔](https://sass-lang.com/)
```bash
npm add -D sass
```


## 安裝 tailwindCSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

修改 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

新增 `index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

記得在 `main.js` 中匯入 index.css
```js
import "@/assets/styles/index.css"
```


## 安裝 Eslint + Prettier
vue3 有提供plugin，支持 ts 的分析器
```bash
npm i -D eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 配置 Eslint
在根目錄新增一個文件，名為 `.eslintrc`
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [],
  "overrides": [],
  "parser": "",
  "parserOptions": {},
  "plugins": [],
  "rules": {}
}
```

### 結合prettier
結合prettier必須安裝
```bash
npm i -D prettier eslint-plugin-prettier eslint-config-prettier
```
然後設定 `.eslintrc`
```json
{
   "extends":["prettier"],
   "plugins":["prettier"],
   "rules":{
      "prettier/prettier": "error"
   }
}
```

### 配置 Prettier
在根目錄新增一文件，名為 `.prettierrc`
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "auto"
}

```

### 測試 Eslint
修改 `Package.json`
```json
{
   "scripts": {
      "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
      //  "lint": "eslint ."
   },
}
```
執行 `npm run lint`

## 安裝 unplugin-auto-import unplugin-vue-components
[unplugin-auto-import 官方文檔](https://www.npmjs.com/package/unplugin-auto-import/v/0.17.1)
[unplugin-vue-components 官方文檔](https://github.com/unplugin/unplugin-vue-components)
```bash
npm i unplugin-auto-import unplugin-vue-components -D
```

### 配置 vite.config.ts
```js
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default {
   plugins:[
      AutoImport({
         // 要匯入的module
         imports: ["vue", "vue-router"], 
         //產生的檔案位置
         dts: resolve(__dirname, "./src/auto-imports.d.ts"), 
      }),

      Components({
         extensions: ["vue"],
         // 包含什麼檔案
         include: [/\.vue$/, /\.vue\?vue/],
         // 產生的檔案的位置
         dts: resolve(__dirname, "./src/components.d.ts"),
         // 從 `./src/components/` `./src/ui` 路徑查找
         dirs: [resolve(__dirname, "./src/components"), resolve(__dirname, "./src/ui")], 
         // 資料夾名稱將會作為檔名 
         directoryAsNamespace: true,
         // 當檔名的prefix與資料夾相同的話將會被合併
         collapseSamePrefixes: true,
         // 處理特定的component
         resolvers: [],
      }),
   ]
}
```

## 安裝 VueRouter
```bash
npm install vue-router
```

## 安裝自動生成路由

## 安裝 i18n
```bash
npm install vue-i18n
```

## 安裝 axios
```bash
npm install axios
```

### 安裝 use-axios-async-data
```bash
npm install use-axios-async-data
```

## 使用 Dockerfile 部署
Build Dockerfile to Image
```bash
docker build -t <your_tag_info> .
```

Run Image
```bash
docker run -d --name <your_container_name> -p 8080:80 <your_tag_name>
```