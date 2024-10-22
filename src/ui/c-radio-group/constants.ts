export const RADIO_GROUP_INJECTION_KEY = Symbol("radioInjectionKey") as InjectionKey<{
  modelValue: Ref<any>;
  readonly: Ref<boolean>;
  disabled: Ref<boolean>;
}>;
