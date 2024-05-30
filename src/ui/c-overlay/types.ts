import { LazyProps } from "../composable/useLazy";
import { ActivatorProps } from "./useActivator";
import { LocationStrategyProps } from "./useLocationStrategy";

export type Point = [x: number, y: number];

export interface OverlayProps extends ActivatorProps, LocationStrategyProps, LazyProps {
  modelValue?: boolean;
  scrim?: boolean | string;
  teleport?: string;
  absolute?: boolean;

  /**
   * 持久化
   * 為 true 時 click outside 時將不會關閉
   */
  persistent?: boolean;

  contentProps?: Record<string, any>;

  // transition
  transition?: string;
}
