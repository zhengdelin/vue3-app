import { ToRefs } from "vue";

export interface CheckboxChild {
  active: Ref<boolean>;
  selectAll: boolean;
  value: Ref<any>;
}

export type CheckboxGroupContext = ToRefs<{
  modelValue: any;
  readonly: boolean;
  disabled: boolean;
}>;
