import { debounce as useDebounce } from "@/composables/useDebounceThrottle";
import { DebounceConfig } from "@/composables/useDebounceThrottle/types";
import { UseVModel, useVModel } from "@/composables/useVModel";

export interface CanDebounceInputProps {
  trigger?: "input" | "change";
  debounce?: boolean;
  debounceConfig?: DebounceConfig;
}

export function createCanDebounceInput<Props extends Record<string, any>, PropName extends keyof Props>(
  ctx: UseVModel<Props, PropName>,
  { trigger = "input", debounce = false, debounceConfig = { immediately: false, delay: 300 } }: CanDebounceInputProps,
) {
  const modelValue = useVModel(ctx);

  function updateModelValue(v: any) {
    modelValue.value = v;
  }

  function output(i: Event) {
    if (!(i as InputEvent).isComposing && i.target && "value" in i.target) {
      updateModelValue(i.target.value);
    }
  }

  const onChange = (() => {
    if (trigger === "change") return output;
  })();

  const onInput = (() => {
    if (trigger === "input") {
      if (debounce) {
        return useDebounce(output, debounceConfig);
      }
      return output;
    }
  })();

  return { modelValue, onChange, onInput, updateModelValue };
}
