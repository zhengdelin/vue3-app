import { InjectionKey, WritableComputedRef } from "vue";
import { ValidatorModelValue } from "../types";

export const KEYS = {
  FORM_MODEL: Symbol("formModal"),
  MODEL_KEY: Symbol("modelKey"),
  DISPLAY_MODEL_KEY: Symbol("displayModelKey"),
  MODEL_VALUE: Symbol("modelValue") as InjectionKey<WritableComputedRef<any> | undefined>,
  I18N_ARGS: Symbol("i18nArgs"),
  HIDE_LABEL: Symbol("hideLabel"),
  DENSITY: Symbol("density") as InjectionKey<ComputedRef<Density>>,
  READONLY: Symbol("readonly"),
  DISABLED: Symbol("disabled"),
  REQUIRED: Symbol("required"),
};

export const MODEL_KEY = computed(() => "");
export const DISPLAY_MODEL_KEY = computed(() => "");
export const FORM_MODEL = () => ref({} as ValidatorModelValue);
export const I18N_ARGS = computed(() => [""]);
export const HIDE_LABEL = computed(() => false);
export const DENSITY = computed(() => undefined);
export const READONLY = computed(() => false);
export const DISABLED = computed(() => false);
export const REQUIRED = computed(() => false);
