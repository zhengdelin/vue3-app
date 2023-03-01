import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

interface PageConfig extends Pick<RouteRecordRaw, "meta" | "beforeEnter"> {
  name?: string;

  /**
   * 路由參數驗證，會直接接在path後面
   * @example
   * 404路由: (.*)* -> /:notFound(.*)*
   * id路由: (\\d+) -> /:id(\\d+)
   */
  validation?: string;
}

type RouteNames = "forgetPassword" | "PageNotFound" | "dashboard" | "dashboardIndex" | "login";

/**
 * 依照views之下的檔案取得路由
 * @param componentModules
 * @param pageModules
 * @returns
 */
function generateRoutes(
  componentModules = import.meta.glob("../views/**/*.vue"),
  pageModules = import.meta.glob<PageConfig>("../views/**/*.ts", {
    eager: true, //轉成模塊
    import: "default", //取出模塊的default
  }),
) {
  const result: RouteRecordRaw[] = [];
  const routeTreeMap: Record<string, RouteRecordRaw> = {};

  function getRouteName(list: string[]) {
    return (list.join("-") || "index") as RouteNames;
  }

  function replaceDynamicRouteName(list: string[]) {
    return list.map((name) => name.replace(":", ""));
  }

  for (const [pagePath, component] of Object.entries(componentModules)) {
    const routePath =
      pagePath
        // ../views/[PageNotFound].vue -> /[PageNotFound]
        .replace(/\.\.\/views|\.vue/g, "")
        // /[PageNotFound] -> /:PageNotFound
        .replace(/\[(.*?)\]/, ":$1")
        // /:PageNotFound -> /:pageNotFound
        .replace(/(?<=\/:?)(.)/g, (_, t) => `${t.toLowerCase()}`) || "/";

    const pageConfig = pageModules[pagePath.replace(".vue", ".ts")] || {};

    //依照路徑取出路由名稱陣列並將:xxx替換為xxx
    const dynamicRouteNameList = routePath.split("/").filter(Boolean),
      routeNameList = replaceDynamicRouteName(dynamicRouteNameList),
      routeName = pageConfig.name || getRouteName(routeNameList),
      isFirstLayer = routeNameList.length === 1;

    routeTreeMap[routeName] = (() => {
      const _path = isFirstLayer ? routePath : dynamicRouteNameList.slice(1).join("/");
      return {
        //替換掉結尾的index字串，ex: /index => /
        path: _path.replace(/index$/, "") + (pageConfig.validation || ""),
        name: routeName,
        component,
        children: routeTreeMap[routeName]?.children || [],
        meta: pageConfig.meta,
        beforeEnter: pageConfig.beforeEnter,
      } as RouteRecordRaw;
    })();

    const curRoute = routeTreeMap[routeName];
    if (isFirstLayer) {
      result.push(curRoute);
    } else {
      //nameList數量大於1時 表示要找上一層的route
      const parentName = getRouteName(routeNameList.slice(0, routeNameList.length - 1));
      routeTreeMap[parentName] ||= { path: "", children: [] };
      routeTreeMap[parentName].children?.push(curRoute);

      //若為子頁面並且為index，則設置父頁面redirect回該子頁面
      if (routeName.endsWith("index")) {
        routeTreeMap[parentName].redirect = { name: routeName };
      }
    }
  }

  return result;
}

export const routes = generateRoutes();
// console.log("routes :>> ", routes);

/**
 * 若想使用ROUTE_NAMES，在新增或刪除頁面時，要手動更新type RouteNames
 *
 * 使用以下程式碼在console可以獲得type RouteNames
 * console.log("更新routeNames :>> ", [...routeNames].map((name) => `"${name.replace(/-(.)/g, (_, char) => char.toUpperCase())}"`).join("|"));
 */
export const ROUTE_NAMES = (() => {
  const names = {} as Record<RouteNames, string>;
  function getNames(_routes = routes) {
    for (let i = 0, len = _routes.length; i < len; i++) {
      const route = _routes[i];

      if (route.name && typeof route.name === "string") {
        const routeName = route.name.replace(/-(.)/g, (_, char) => char.toUpperCase()) as RouteNames;
        names[routeName] = route.name;
      }

      if (route.children?.length) {
        getNames(route.children);
      }
    }
  }
  getNames();
  return names;
})();

// console.log("ROUTE_NAMES :>> ", ROUTE_NAMES);
console.log(
  "更新routeNames :>> ",
  Object.keys(ROUTE_NAMES)
    .map((i) => `"${i}"`)
    .join("|"),
);

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to) => {
  const title = to.meta.title;
  document.title = title || "vue3-app";
});

export function installRouter(app: App) {
  app.use(router);
}

export function definePageConfig(config: PageConfig) {
  return config;
}
