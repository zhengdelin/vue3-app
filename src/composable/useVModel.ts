import type { WritableComputedRef, Ref } from "vue";
import { getCurrentInstance, computed, ref, watch, toRaw } from "vue";
import { toKebabCase } from "@/utils/string";
import useToggleScope from "@/composable/useToggleScope";

/**
 * 表示 useVModel 可組合函數的配置選項。
 */
export interface UseVModel<
  Props extends Record<string, any>,
  PropName extends keyof Props = keyof Props,
  Inner = Props[PropName],
> {
  props: Props;
  propName?: PropName;
  emit?: any;
  setter?(v: Inner): void;
  transformIn?(value?: Props[PropName]): Inner;
  transformOut?(value: Inner): Props[PropName];
}

/**
 * 創建一個 WritableComputedRef 物件，以提供基於提供的選項的雙向綁定功能。
 * @template Props - props 物件的類型。
 * @template PropName - prop 名稱的類型。
 * @template Inner - prop 的內部類型。
 * @param {UseVModel<Props, PropName, Inner>} options - 用於配置 useVModel 可組合函數的選項。
 * @returns {WritableComputedRef<Inner>} - 表示計算值的 WritableComputedRef 物件。
 */
export function useVModel<
  Props extends Record<string, any>,
  PropName extends keyof Props = "modelValue",
  Inner = Props[PropName],
>(options: UseVModel<Props, PropName, Inner>): WritableComputedRef<Inner> {
  const {
    props,
    propName = "modelValue" as PropName,
    emit,
    setter,
    transformIn = (v) => v,
    transformOut = (v) => v as Props[PropName],
  } = options;
  const vm = getCurrentInstance();

  // 如果未傳遞 VModel，則創建內部模型
  const internalModel = ref<Props[PropName]>(props[propName]);

  // 檢查是否傳遞了 VModel
  const isControlled = checkPropIsPassed(options);

  // 當未傳遞 VModel 時，開始監視 props 以同步內部模型
  useToggleScope(
    () => !isControlled.value,
    () => {
      watch(
        () => props[propName],
        (val) => {
          internalModel.value = val;
        },
      );
    },
  );

  // 根據是否傳遞了 VModel 計算外部值
  const externalValue = computed(() => (isControlled.value ? props[propName] : internalModel.value));

  return computed({
    get: (): any => {
      return transformIn(externalValue.value);
    },
    set:
      setter ??
      ((val: Inner) => {
        const newValue = transformOut(val);
        const oldValue = toRaw(externalValue.value);
        if (oldValue === newValue || transformIn(oldValue) === val) {
          return;
        }
        internalModel.value = newValue;
        (emit ?? vm?.emit)?.(`update:${propName as string}`, newValue);
      }),
  }) as unknown as WritableComputedRef<Inner>;
}

/**
 * 表示 useVDeepModel 可組合函數的配置選項。
 * @template Props - props 物件的類型。
 * @template PropName - prop 名稱的類型。
 */
export interface UseVDeepModel<Props extends Record<string, any>, PropName extends keyof Props = "modelValue"> {
  props: Props;
  propName?: PropName;
  emit?: any;
}

/**
 * 創建一個 WritableComputedRef 物件，以提供基於提供的選項的深層雙向綁定功能。
 * @template Props - props 物件的類型。
 * @template PropName - prop 名稱的類型。
 * @param {Omit<UseVModel<Props, PropName>, "transformIn" | "transformOut" | "setter">} options - 用於配置 useVDeepModel 可組合函數的選項。
 * @returns {WritableComputedRef<Props[PropName]>} - 表示計算值的 WritableComputedRef 物件。
 */
export function useVDeepModel<Props extends Record<string, any>, PropName extends keyof Props = "modelValue">(
  options: Omit<UseVModel<Props, PropName>, "transformIn" | "transformOut" | "setter">,
): WritableComputedRef<Props[PropName]> {
  const { props, propName = "modelValue" as PropName, emit } = options;
  const vm = getCurrentInstance();
  return computed({
    get() {
      const val = props[propName];
      if (!val) return val;
      const observe = <TargetType extends object>(target: TargetType): TargetType => {
        return new Proxy<TargetType>(target, {
          get(obj, prop) {
            const externalValue = obj[prop as keyof typeof obj];
            return externalValue;
          },
          set(obj, prop, v) {
            Object.assign(obj, { [prop]: v });
            (emit ?? vm?.emit)?.(`update:${propName as string}`, obj);
            return true;
          },
        });
      };
      return observe(val);
    },
    set(v) {
      (emit ?? vm?.emit)?.(`update:${propName as string}`, v);
    },
  });
}

/**
 * 檢查props是否傳遞了prop。
 * @template Props - props 物件的類型。
 * @template PropName - prop 名稱的類型。
 * @param {Pick<UseVModel<Props, PropName>, "props" | "propName">} options - 用於配置檢查的選項。
 * @returns {Ref<boolean>} - 表示布爾值的 Ref 物件，指示是否傳遞了 VModel。
 */
export function checkPropIsPassed<Props extends Record<string, any>, PropName extends keyof Props = "modelValue">(
  options: Pick<UseVModel<Props, PropName>, "props" | "propName">,
): Ref<boolean> {
  const { props } = options;
  const propName = options.propName || ("modelValue" as PropName);
  const vm = getCurrentInstance();
  if (!vm) return computed(() => false);

  const kebabPropName = toKebabCase(propName as string);
  const checkKebab = kebabPropName !== propName;

  if (checkKebab) {
    return computed(() => {
      void props[propName];
      const _props = vm.vnode.props;
      if (!_props) return false;
      return !!(
        (propName in _props || kebabPropName in _props) &&
        (`onUpdate:${propName as string}` in _props || `onUpdate:${kebabPropName}` in _props)
      );
    });
  }
  return computed(() => {
    void props[propName];
    const _props = vm.vnode.props;
    if (!_props) return false;
    return !!(propName in _props && `onUpdate:${propName as string}` in _props);
  });
}
