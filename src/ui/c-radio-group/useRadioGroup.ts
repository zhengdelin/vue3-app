import { RADIO_GROUP_INJECTION_KEY } from "./constants";
import { RadioGroupContext } from "./types";

export function provideRadioGroup<ModelValueType = any>({
  modelValue,
  readonly,
  disabled,
}: RadioGroupContext<ModelValueType>) {
  provide(RADIO_GROUP_INJECTION_KEY, { modelValue, readonly, disabled });
}
