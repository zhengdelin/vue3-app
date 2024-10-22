import { Permission } from "@/constants/permissions";
export {};

declare module "vue-router" {
  interface RouteMeta {
    title?: string | ((to: RouteLocationNormalized) => string);
    pageTitle?: string | ((to: RouteLocationNormalized) => string);
    transformedPageTitle?: string;
    permissions?: Permission[];
  }
}
