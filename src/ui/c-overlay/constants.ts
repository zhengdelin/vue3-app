import { makePropsDefault } from "../utils/props";
import { OverlayProps } from "./types";
export const OVERLAY_PROPS_DEFAULT = makePropsDefault<OverlayProps>({
  modelValue: false,
  scrim: false,
  teleport: "body",
  transition: "fade",
  contentProps: undefined,
});
