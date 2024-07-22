import envVars from "@/constants/env-vars";
import { generateRoutes } from "vite-plugin-routes-generator";
import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export const routes = generateRoutes({
  components: import.meta.glob(`../views/**\/*.vue`),
  routeConfigs: import.meta.glob(`../views/**\/*.ts`, {
    eager: true, //轉成模塊
    import: "default", //取出模塊的default
  }),
});
export const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

router.beforeEach((to) => {
  const _getTitle = (title: any) => (title ? (typeof title === "string" ? title : title(to)) : "");
  const defaultTitle = envVars.globSetting.title || "vue3-app";
  const title = _getTitle(to.meta.title);
  const pageTitle = _getTitle(to.meta.pageTitle);
  to.meta.pageTitle = pageTitle;
  if (title) {
    document.title = title;
    return;
  }
  if (pageTitle) {
    to.meta.transformedPageTitle = document.title = `${pageTitle ? pageTitle + " - " : ""}${defaultTitle}`;
    return;
  }
  document.title = defaultTitle;
});

export function installRouter(app: App) {
  app.use(router);
}
