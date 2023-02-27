import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardWithThis } from "vue-router";

interface PageConfig extends Pick<RouteRecordRaw, "meta" | "beforeEnter"> {
  /**
   * 路由驗證器
   */
  validate?: NavigationGuardWithThis<undefined>;
}

type RouteNames = "about" | "aboutId" | "aboutIndex" | "index" | "login";
const routeNames = new Set<RouteNames>();

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
    //取出路徑 替換掉../views、.vue，並將[xxx]替換為:xxx
    const routePath = pagePath.replace(/\.\.\/views|\.vue/g, "").replace(/\[(.*?)\]/, ":$1") || "/";

    //依照路徑取出路由名稱陣列並將:xxx替換為xxx
    const dynamicRouteNameList = routePath.split("/").filter(Boolean),
      routeNameList = replaceDynamicRouteName(dynamicRouteNameList),
      //當前路由的名稱
      routeName = getRouteName(routeNameList),
      //當前路由層數
      isFirstLayer = routeNameList.length === 1;

    routeNames.add(routeName);

    const { meta, beforeEnter, validate } = pageModules[pagePath.replace(".vue", ".ts")] || {};

    routeTreeMap[routeName] = (() => {
      const _path = isFirstLayer ? routePath : dynamicRouteNameList.slice(1).join("/");
      return {
        //替換掉結尾的index字串，ex: /index => /
        path: _path.replace(/index$/, ""),
        name: routeName,
        component,
        children: routeTreeMap[routeName]?.children || [],
        meta,
        beforeEnter: (() => {
          const _beforeEnter = Array.isArray(beforeEnter) ? beforeEnter : beforeEnter ? [beforeEnter] : [];
          validate && _beforeEnter.push(validate);
          return _beforeEnter;
        })(),
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
export const ROUTE_NAMES = [...routeNames].reduce((prev, name) => {
  prev[name] = name;
  return prev;
}, {} as Record<RouteNames, string>);

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
