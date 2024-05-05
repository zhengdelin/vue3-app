import { ToRefs } from "vue";
import { CHECKBOX_INJECTION_KEY } from "./constants";

export interface CheckboxChild {
  active: Ref<boolean>;
  selectAll: boolean;
  value: Ref<any>;
}

type CheckboxGroupContext = ToRefs<{
  modelValue: any;
  readonly: boolean;
  disabled: boolean;
}>;

function createCheckboxSelectAll(modelValue: Ref<any>) {
  const children = reactive<CheckboxChild[]>([]);
  const childrenCount = computed(() => children.length);
  const isAllSelected = computed(() => {
    return children.every((child) => child.active);
  });
  const childrenOfSelectAll = reactive<CheckboxChild[]>([]);
  const toggleSelectAll = () => {
    if (!childrenCount.value) return false;
    if (isAllSelected.value) {
      unselectAll();
      return false;
    } else {
      selectAll();
      return true;
    }
  };
  const selectAll = () => {
    modelValue.value = children.map((i) => i.value);
  };
  const unselectAll = () => {
    modelValue.value = [];
  };

  return {
    children,
    childrenCount,
    isAllSelected,
    childrenOfSelectAll,
    toggleSelectAll,
    selectAll,
    unselectAll,
  };
}

/**
 * Provides a checkbox group context to child components and sets up initial state.
 *
 * @param {CheckboxGroupContext} param1
 * @param {CheckboxGroupContext} param1.modelValue - The model value for the checkbox group.
 * @param {Ref<boolean>} param1.readonly - Whether the checkbox group is read-only.
 * @param {Ref<boolean>} param1.disabled - Whether the checkbox group is disabled.
 * @return
 */
export function provideCheckboxGroup({ modelValue, readonly, disabled }: CheckboxGroupContext) {
  const { children, childrenOfSelectAll, childrenCount, isAllSelected, toggleSelectAll, selectAll, unselectAll } =
    createCheckboxSelectAll(modelValue);

  // 提供環境給子組件
  provide(CHECKBOX_INJECTION_KEY, {
    children,
    childrenCount,
    isAllSelected,
    modelValue,
    readonly,
    disabled,
    registerChild: (data: CheckboxChild) => {
      const _children = data.selectAll ? childrenOfSelectAll : children;
      _children.push(data as any);
      return () => {
        _children.splice(_children.indexOf(data as any), 1);
      };
    },
    toggleSelectAll,
    selectAll,
    unselectAll,
  });

  // 子組件初始化後，設定初始狀態
  nextTick(() => {
    const count = childrenCount.value;
    if (!count) return;
    if (count === 1) {
      //
    } else if (!Array.isArray(modelValue.value)) {
      modelValue.value = [];
    }
  });

  return {
    selectAll,
    toggleSelectAll,
    unselectAll,
    isAllSelected,
    childrenCount,
    children,
  };
}
