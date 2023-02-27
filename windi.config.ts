/**
 * *安裝
 * npm i -D vite-plugin-windicss windicss
 *
 * *配置vite.config.ts
 * import WindiCSS from "vite-plugin-windicss";
 * plugins:[WindiCSS()]
 *
 * *配置main.ts
 * import "virtual:windi.css";
 */

import { defineConfig } from "windicss/helpers";
// import formsPlugin from "windicss/plugin/forms";

export default defineConfig({
  //   darkMode: "class",
  //   safelist: "p-3 p-4 p-5",
  //   theme: {
  //     extend: {
  //       colors: {
  //         teal: {
  //           100: "#096",
  //         },
  //       },
  //     },
  //   },
  //   plugins: [formsPlugin],
});
