import { RouteLocationRaw } from "vue-router";

export interface CBtnProps {
  disabled?: boolean;
  loading?: boolean;
  to?: RouteLocationRaw;
  block?: boolean;
}
