import { makePropsDefault } from "../utils/props";
import { InputContainerProps } from "./types";

export const INPUT_CONTAINER_PROPS_DEFAULT = makePropsDefault<InputContainerProps>({
  size: "medium",
  error: false,
  errorMessage: "",
  height: undefined,
  width: undefined,
  hideDetails: undefined,
});
