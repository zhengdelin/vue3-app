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
    dts: true,
  }),

  Components({
    // 從 `./src/components/` 路徑查找
    extensions: ["vue"],
    include: [/\.vue$/, /\.vue\?vue/],
    dts: true,
    dirs: [resolve(__dirname, "src/components")],
  }),
];

// function getPages(mode: string) {
//   const allPages = {
//     admin: resolve(__dirname, "src/pages/admin/index.html"),
//     agent: resolve(__dirname, "src/pages/agent/index.html"),
//   };
//   const isDevOrProd = mode === "development" || mode === "production";
//   if (isDevOrProd) {
//     return allPages;
//   }
//   return { [mode]: allPages[mode] };
// }

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = +env.PORT || 3000;
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
