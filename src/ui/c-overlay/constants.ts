import { makePropsDefault } from "../utils/props";
import { OverlayProps } from "./types";
import { ACTIVATOR_PROPS_DEFAULT } from "./useActivator";
import { LOCATION_STRATEGY_PROPS_DEFAULT } from "./useLocationStrategy";
export const OVERLAY_PROPS_DEFAULT = makePropsDefault<OverlayProps>({
  ...ACTIVATOR_PROPS_DEFAULT,
  ...LOCATION_STRATEGY_PROPS_DEFAULT,
  modelValue: false,
  scrim: false,
  teleport: "body",
  transition: "fade",
  contentProps: undefined,
});

interface P {
  a: number;
  b: string;
}
