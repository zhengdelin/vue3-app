import { LazyProps } from "../composable/useLazy";

export type Point = [x: number, y: number];

export interface OverlayProps extends LazyProps {
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
