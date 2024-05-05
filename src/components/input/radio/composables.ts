import { ToRefs } from "vue";
import { RADIO_INJECTION_KEY } from "./constants";

type RadioGroupContext = ToRefs<{
  modelValue: any;
  readonly: boolean;
  disabled: boolean;
}>;

export function provideRadioGroup({ modelValue, readonly, disabled }: RadioGroupContext) {
  provide(RADIO_INJECTION_KEY, { modelValue, readonly, disabled });
}
