import useVuelidate from "@vuelidate/core";
import { Ref, WritableComputedRef, UnwrapRef } from "vue";
import { AllValidators } from "./validators";

export type ValidatorModelValue<T extends string = string> = { [key in T]: any | ValidatorModelValue<T> };

export interface ValidatorRulesDefinition {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface ValidatorRuleKey<T extends string = string> {
  key: T;
  path: string[];
  nested: ValidatorRuleKey<T>[];
  rulesDefinition?: ValidatorRulesDefinition;
  rules?: object;
  /** 與rules一起使用才有效果 將會綁定到validator的property */
  i18nProperty?: string;
  /** 與rules一起使用才有效果 將會綁定到validator的args */
  i18nArgs?: any[];
  /**
   * @deprecated 已棄用，請改用ValidateEach組件
   * @component "./components/ValidateEach.vue"
   */
  isNestedArray?: boolean;
}

export type UseValidatorRuleKey<T extends string> = {
  key: T;
  nested?: UseValidatorRuleKey<T>[];
  rulesDefinition?: ValidatorRulesDefinition;
  rules?: ValidatorRuleKey<T>["rules"];

  /** 與rulesDefinition一起使用才有效果 將會綁定到validator的property */
  i18nProperty?: ValidatorRuleKey<T>["i18nProperty"];
  /** 與rulesDefinition一起使用才有效果 將會綁定到validator的args */
  i18nArgs?: ValidatorRuleKey<T>["i18nArgs"];
  // isNestedArray?: ValidatorRuleKey<T>["isNestedArray"];
};
export type UseValidatorRuleKeysRaw<T extends string> = UseValidatorRuleKey<T>[];
export type UseValidatorRuleKeysFunctionRaw<T extends string> = (validator: AllValidators) => UseValidatorRuleKeysRaw<T>;
export type UseValidatorRuleKeys<T extends string> = MaybeRef<UseValidatorRuleKeysRaw<T> | UseValidatorRuleKeysFunctionRaw<T>>;
export type UnwrapUseValidatorRuleKeys<T extends string> = UnwrapRef<UseValidatorRuleKeys<T>>;

export type ValidatorRules<T extends string> = { [Key in T]: object | ValidatorRules<T> };

export type Validator = ReturnType<typeof useVuelidate<any, any>>;
export type UnwrapValidator = UnwrapRef<Validator>;
export interface ValidatorConfig<Key extends string> {
  provideToChild?: boolean;
  convertedRuleKeys?: ValidatorRuleKey<Key>[] | Ref<ValidatorRuleKey<Key>[] | undefined>;
  convertedRules?: ValidatorRules<Key> | Ref<ValidatorRules<Key>>;
}

export type ValidatorErrorMessages<T extends string> = Record<T, string[]>;
export type ValidatorModels<T extends string> = Record<T, WritableComputedRef<any>>;
export type ValidatorInvalids<T extends string> = Record<T, boolean>;
export type ValidatorUtils<T extends string = string> = {
  errorMessages: ValidatorErrorMessages<T>;
  /**
   * 改統一使用formModel和auto-dirty搭配
   * @deprecated
   */
  models: ValidatorModels<T>;
  /**
   * 改使用$validator.value.$invalid
   * @deprecated
   */
  invalids: ValidatorInvalids<T>;
};

export type ValidatorProvider = Validator;
export type ValidatorUtilsProvider = globalThis.ComputedRef<ValidatorUtils>;
export type ValidatorDisabled = globalThis.ComputedRef<boolean>;
