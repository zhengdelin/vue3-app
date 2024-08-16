import { isObjectEqual } from "@/utils/object";
import type { RouteLocationRaw } from "vue-router";
export default function () {
  const router = useRouter();
  function compare(route?: RouteLocationRaw, currentRoute = router.currentRoute.value) {
    if (!route) return false;

    const compareFunctions = [];
    if (typeof route === "string") {
      compareFunctions.push(() => currentRoute.fullPath === route);
    } else {
      if ("name" in route) {
        compareFunctions.push(() => currentRoute.name === route.name);
      }
      if ("path" in route) {
        compareFunctions.push(() => currentRoute.path === route.path);
      }
      if ("query" in route) {
        compareFunctions.push(() => isObjectEqual(currentRoute.query, route.query));
      }
      if ("params" in route) {
        compareFunctions.push(() => isObjectEqual(currentRoute.params, route.params));
      }
    }
    return compareFunctions.every((fn) => fn());
  }

  return {
    router,
    compare,
  };
}
