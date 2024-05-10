import { ToRefs } from "vue";

export type RadioGroupContext<ModelValueType = any> = ToRefs<{
  modelValue: ModelValueType;
  readonly: boolean;
  disabled: boolean;
}>;
