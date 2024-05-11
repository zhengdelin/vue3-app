import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { generateRoutes } from "vite-plugin-routes-generator";

export const routes = generateRoutes({
  components: import.meta.glob(`../views/**\/*.vue`),
  routeConfigs: import.meta.glob(`../views/**\/*.ts`, {
    eager: true, //轉成模塊
    import: "default", //取出模塊的default
  }),
});

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

router.beforeEach((to) => {
  const title = to.meta.title;
  document.title = title || "vue3-app";
});

export function installRouter(app: App) {
  app.use(router);
}
