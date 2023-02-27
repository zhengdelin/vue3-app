import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import WindiCSS from "vite-plugin-windicss";

/**
 * 自動引入
 * npm i unplugin-auto-import unplugin-vue-components -D
 */
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
const UnpluginAutoImport = [
  AutoImport({
    imports: ["vue", "vue-router"],
    dts: "src/auto-imports.ts",
  }),

  Components({
    // 從 `./src/components/` 路徑查找
    extensions: ["vue"],
    include: [/\.vue$/, /\.vue\?vue/],
    dts: "src/auto-components.ts",
  }),
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = +env.PORT || 3000;
  return {
    plugins: [vue(), ...UnpluginAutoImport, WindiCSS()],

    server: {
      port: port,
      host: "0.0.0.0",
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
