import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import viteCompression from "vite-plugin-compression";

/**
 * 自動引入
 * npm i unplugin-auto-import unplugin-vue-components -D
 */
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
const UnpluginAutoImport = [
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
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = +env.PORT || 3000;

  // 多頁應用用
  // const model = env.VITE_APP_MODEL || "";
  // const pages = (() => {
  //   const allPages = {
  //     admin: resolve(__dirname, "src/pages/admin/index.html"),
  //     agent: resolve(__dirname, "src/pages/agent/index.html"),
  //   };
  //   if (!model) {
  //     return allPages;
  //   }
  //   return allPages[model];
  // })();
  // const root = `./src/pages/${model}`;

  return {
    plugins: [
      vue(),
      vueJsx(),
      // gzip压缩 生产环境生成 .gz 文件
      viteCompression(),
      ...UnpluginAutoImport,
    ],

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/global.scss" as *;',
        },
      },
    },

    server: {
      port: port,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: env.VITE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port,
    },

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },

    root: "./",
    build: {
      rollupOptions: {
        // input: ,
        output: {
          dir: "./dist",
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/css/[name]-[hash].[ext]",
        },
      },
    },
  };
});
