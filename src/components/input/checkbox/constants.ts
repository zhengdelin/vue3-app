import { UnwrapNestedRefs } from "vue";
import { CheckboxChild } from "./composables";

export const CHECKBOX_INJECTION_KEY = Symbol("checkboxInjectionKey") as InjectionKey<{
  modelValue: Ref<any>;
  readonly: Ref<boolean>;
  disabled: Ref<boolean>;

  children: UnwrapNestedRefs<CheckboxChild[]>;
  childrenCount: ComputedRef<number>;
  isAllSelected: ComputedRef<boolean>;

  registerChild: (data: CheckboxChild) => () => void;
  /**
   *
   * @returns true: all selected, false: not
   */
  toggleSelectAll: () => boolean;
  selectAll: () => void;
  unselectAll: () => void;
}>;
