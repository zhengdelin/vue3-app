import { makePropsDefault } from "../utils/props";
import { InputControlProps } from "./types";

export const INPUT_CONTROL_PROPS_DEFAULT = makePropsDefault<InputControlProps>({
  label: "",
  required: false,
  clearable: true,
  readonly: false,
  disabled: false,
  alwaysFocus: false,
  focus: false,
  bordered: true,
  active: false,
});
