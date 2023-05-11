import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import WindiCSS from "vite-plugin-windicss";
import viteCompression from "vite-plugin-compression";

/**
 * 自動引入
 * npm i unplugin-auto-import unplugin-vue-components -D
 */
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
const UnpluginAutoImport = [
  AutoImport({
    imports: ["vue", "vue-router"],
    dts: resolve(__dirname, "./src/auto-imports.d.ts"),
  }),

  Components({
    // 從 `./src/components/` 路徑查找
    extensions: ["vue"],
    include: [/\.vue$/, /\.vue\?vue/],
    dts: resolve(__dirname, "./src/components.d.ts"),
    dirs: [resolve(__dirname, "src/components")],
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
      // gzip压缩 生产环境生成 .gz 文件
      viteCompression(),
      ...UnpluginAutoImport,
      WindiCSS(),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/global.scss";',
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
