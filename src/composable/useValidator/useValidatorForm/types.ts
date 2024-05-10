import { WritableComputedRef } from "vue";
import { UseVModel } from "@/composable/useVModel";

export interface ValidatorFormFieldBasicProps {
  modelValue?: any;
  /**
   * 用來綁定label、errorMessages、placeholder的key
   */
  modelKey?: string;
  /**
   * 用來綁定label、placeholder的key 預設為modelKey
   */
  displayModelKey?: string;
  i18nArgs?: any[];
  errorMessages?: string | string[];
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  hidePlaceholder?: boolean;
  density?: Density;

  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface ValidatorFormConfig<T extends ValidatorFormFieldBasicProps> extends UseVModel<T> {
  defaultModelValue?: WritableComputedRef<any>;
}

export interface ValidatorFormFieldProvider {
  <T extends ValidatorFormFieldBasicProps>(config: ValidatorFormConfig<T>): void;
  modelValue<T extends ValidatorFormFieldBasicProps>(config: ValidatorFormConfig<T>): void;
  modelKey<T extends ValidatorFormFieldBasicProps>(props: T): void;
  displayModelKey<T extends ValidatorFormFieldBasicProps>(props: T): void;
  hideLabel<T extends ValidatorFormFieldBasicProps>(props: T): void;
  i18nArgs<T extends ValidatorFormFieldBasicProps>(props: T): void;
  density<T extends ValidatorFormFieldBasicProps>(props: T): void;
  readonly<T extends ValidatorFormFieldBasicProps>(props: T): void;
  disabled<T extends ValidatorFormFieldBasicProps>(props: T): void;
  required<T extends ValidatorFormFieldBasicProps>(props: T): void;
}

interface _UseValidatorFormFieldKeyResult {
  fullKey: string;
  key: string;
  path: string[];
}

interface UseValidatorFormFieldKeyResult {
  modelKey: ComputedRef<_UseValidatorFormFieldKeyResult>;
  displayModelKey: ComputedRef<_UseValidatorFormFieldKeyResult>;
}

interface UseValidatorFormFieldModelResult extends UseValidatorFormFieldKeyResult {
  modelV: WritableComputedRef<any>;
}

interface UseValidatorFormFieldLabelResult {
  i18nArgs: ComputedRef<any[]>;
  label: ComputedRef<string | undefined>;
  placeholder: ComputedRef<string | undefined>;
  hideLabel: ComputedRef<boolean>;
  hidePlaceholder: ComputedRef<boolean>;
}

interface UseValidatorFormFieldConfigResult {
  errorMessages: ComputedRef<string | string[]>;
  density: ComputedRef<Density>;
  readonly: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
  required: ComputedRef<boolean>;
}

export interface UseValidatorFormField {
  <T extends ValidatorFormFieldBasicProps>(config: ValidatorFormConfig<T>): UseValidatorFormFieldKeyResult &
    UseValidatorFormFieldModelResult &
    UseValidatorFormFieldLabelResult &
    UseValidatorFormFieldConfigResult;
  key<T extends ValidatorFormFieldBasicProps>(props: T): UseValidatorFormFieldKeyResult;
  model<T extends ValidatorFormFieldBasicProps>(config: ValidatorFormConfig<T>): UseValidatorFormFieldModelResult;
  label<T extends ValidatorFormFieldBasicProps>(
    props: T,
    keys: UseValidatorFormFieldKeyResult["modelKey"],
  ): UseValidatorFormFieldLabelResult;
  config<T extends ValidatorFormFieldBasicProps>(
    props: T,
    keys: UseValidatorFormFieldKeyResult["modelKey"],
  ): UseValidatorFormFieldConfigResult;
}
