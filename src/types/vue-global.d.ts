export {};

declare module "vue-router" {
  interface RouteMeta {
    title?: string | ((to: RouteLocationNormalized) => string);
  }
}
