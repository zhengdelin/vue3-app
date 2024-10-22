import { RouteLocationNormalizedLoaded, RouteLocationRaw } from "vue-router";

/**
 * @param tab 切換成的tab值
 * @param route 切換的路由
 */
export type TabOnBeforeTabChangeNext<T = any> = (tab?: T, route?: RouteLocationRaw) => void;

export type TabOnBeforeTabChange<T = any> = (tab: T, next: TabOnBeforeTabChangeNext<T>) => MaybePromise<Maybe<boolean>>;

export interface Tab<T = any> {
  title?: string;
  value?: T;
  /**
   * 設置該tab的路由 將會覆蓋所有Tabs組件的設定
   */
  route?: RouteLocationRaw | ((curRoute: RouteLocationNormalizedLoaded) => RouteLocationRaw);
  /**
   * tab切換前運行的函數，可手動使用next切換tab
   * @param tab
   * @param next
   * @returns 回傳true表示切換
   */
  onBeforeTabChange?: TabOnBeforeTabChange<T>;
}
