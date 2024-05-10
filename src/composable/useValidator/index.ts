import { useVuelidate, ErrorObject } from "@vuelidate/core";
import { unref } from "vue";
import {
  UseValidatorRuleKeys,
  ValidatorUtils,
  UnwrapValidator,
  ValidatorRuleKey,
  ValidatorConfig,
  ValidatorModelValue,
  ValidatorRules,
  UseValidatorRuleKeysRaw,
  ValidatorRulesDefinition,
} from "./types";
import { provideValidator } from "./useValidatorProvider/index";
import { defineRulesWithValidators, withI18nMessageValidator } from "./validators";

export { useVuelidate };
export * from "./useValidatorProvider/index";
export * from "./useValidatorForm/index";
export * from "./types";
export * from "./validators";

export const getValidator = computed(() => (path: string | string[], $validator: UnwrapValidator) => {
  return Object.get(path, $validator) as UnwrapValidator | undefined;
});

function isNestedRuleKey(ruleKey: ValidatorRuleKey) {
  return ruleKey.nested.length > 0;
}

const rulesDefinitionMap = new Map<keyof ValidatorRulesDefinition, (args: any) => object>([
  ["required", () => defineRulesWithValidators((v) => v.required)],
  ["email", () => defineRulesWithValidators((v) => v.email)],
  ["minLength", (num: number) => defineRulesWithValidators((v) => v.minLength(num))],
  ["maxLength", (num: number) => defineRulesWithValidators((v) => v.maxLength(num))],
]);

function getRulesFromRulesDefinition({ rulesDefinition: definition, i18nProperty, i18nArgs }: ValidatorRuleKey): any {
  if (!definition) return {};
  const keys = Object.keys(definition);
  if (!keys.length) {
    return {};
  }

  const handler =
    i18nProperty || i18nArgs
      ? (validator: any) => withI18nMessageValidator(validator, { property: i18nProperty as any, args: i18nArgs })
      : (validator: any) => validator;

  return keys.reduce((prev, key) => {
    const val = definition[key as keyof typeof definition];
    if (val) {
      const fn = rulesDefinitionMap.get(key as keyof ValidatorRulesDefinition);
      typeof fn === "function" && (prev[key] = handler(fn(val)));
    }
    return prev;
  }, {} as any);
}

export function getValidatorRules<Key extends string>(ruleKeys: ValidatorRuleKey<Key>[]) {
  const curRules = {} as ValidatorRules<Key>;
  if (!ruleKeys.length) return curRules;

  return (function _get(_ruleKeys: ValidatorRuleKey<Key>[], result: ValidatorRules<Key> = curRules) {
    for (const ruleKey of _ruleKeys) {
      const { key, nested, rules } = ruleKey;
      if (isNestedRuleKey(ruleKey)) {
        // if (isNestedArray) {
        //   const nestedArrayResult = {} as any;
        //   _get(nested, nestedArrayResult);
        //   console.log("nestedArrayResult :>> ", nestedArrayResult);
        //   result[key] = helpers.forEach(nestedArrayResult) as any;
        // } else
        _get(nested, (result[key] = {} as any));
        continue;
      }

      // 自訂義
      if (rules) {
        result[key] = rules as any;
        continue;
      }

      if (ruleKey.rulesDefinition) {
        result[key] = getRulesFromRulesDefinition(ruleKey);
        continue;
      }
    }
    return result;
  })(ruleKeys);
}

export function getValidatorErrorMessage($v: UnwrapValidator) {
  const errors = $v.$errors;
  return errors.map(({ $message, $response }: ErrorObject) => {
    const message = typeof $message === "string" ? $message : $message.value;
    return ($response ? $response.$message : message) as string;
  });
}

export function getValidatorModel($v: UnwrapValidator) {
  // return ref($v.$model);
  return computed({
    get() {
      // console.log("$v :>> ", $v, path, $validator);
      return $v.$model;
    },
    set(val) {
      $v.$model = val;
    },
  });
  return $v.$model;
}

export function getValidatorUtils<Key extends string, ValidatorT extends UnwrapValidator>(
  ruleKeys: ValidatorRuleKey<Key>[],
  $validator: ValidatorT,
) {
  const utils = {
    errorMessages: {},
    models: {},
    invalids: {},
  } as ValidatorUtils;

  (function _get(_ruleKeys: ValidatorRuleKey<Key>[]) {
    for (const ruleKey of _ruleKeys) {
      const { path: pathArr, nested } = ruleKey;
      if (isNestedRuleKey(ruleKey)) {
        _get(nested);
        continue;
      }
      const $v = getValidator.value(pathArr, $validator);
      if (!$v) continue;
      const path = pathArr.join(".");
      // console.group(path, " :>> ", $v);
      // console.table(ruleKey);
      // console.groupEnd();

      utils.errorMessages[path] = getValidatorErrorMessage($v);
      // utils.models[path] = getValidatorModel($v);
      // utils.invalids[path] = $v.$invalid;
      // console.log("utils :>> ", utils);
    }
  })(ruleKeys);
  return utils;
}

// const NESTED_ARRAY_KEY = "$each";
export function getConvertedRuleKeys<Key extends string>(_keys: UseValidatorRuleKeys<Key>) {
  _keys = unref(_keys);

  // if (typeof _keys === "function") _keys = _keys(validators.value);
  // console.log("keys :>> ", keys);
  return (function _get(_keys?: UseValidatorRuleKeysRaw<Key>, parentPath: string[] = []) {
    const keys = _keys || [];

    if (!keys?.length) return [];

    return keys.reduce((result, i) => {
      const _ruleKey = typeof i === "string" ? { key: i } : i;

      // if (_ruleKey.isNestedArray && _ruleKey.key !== NESTED_ARRAY_KEY) {
      //   _ruleKey.nested = [
      //     {
      //       key: NESTED_ARRAY_KEY,
      //       isNestedArray: true,
      //       nested: _ruleKey.nested,
      //     },
      //   ];
      //   _ruleKey.isNestedArray = false;
      // }

      const path = [...parentPath, _ruleKey.key] as string[];
      const ruleKey = Object.assign(_ruleKey, { path, nested: _get(_ruleKey.nested, path) }) as ValidatorRuleKey<Key>;

      // console.log("ruleKey :>> ", ruleKey);
      result.push(ruleKey);
      return result;
    }, [] as ValidatorRuleKey<Key>[]);
  })(typeof _keys === "function" ? defineRulesWithValidators(_keys) : _keys);
}

/**
 * 使用Vuelidate 傳入keys, data
 * @param _ruleKeys
 * @example <caption>基礎用法</caption>
 * data: { name: "", email: "", password: "" }
 * input: ["name", "email", "password"]
 * output: { name: Validators, email: Validators, password: Validators }
 * modelKey: "name", "email", "password"
 * @example <caption>物件巢狀</caption>
 * data: { name: "", email: "", password: "", address: { town: "" } }
 * input: ["name", "email", "password", { key: "address", nested:["town"] }]
 * output: { name: Validators, email: Validators, password: Validators, address: { town: Validators }}
 * modelKey: "name", "email", "password", "address.town"
 * @example <caption>自訂義validator</caption>
 * data: { name: "" }
 * input: (validators) => ({ { key:"name", validator: MyValidator } })
 * output: { name: MyValidator }
 * modelKey: "name"
 * @example <caption>Array contains object !!請使用ValidateEach組件</caption>
 * ```js
 * const data = reactive({
 *  data: [
 *    { email: "email@gmail.com", nested: { password: "password" } },
 *    { email: "email@gmail.com", nested: { password: "password" } },
 *  ],
 * });
 * const dataRuleKeys = getConvertedRuleKeys(["email", { key: "nested2", nested: ["password"] }]);
 * const dataRules = computed(() => getValidatorRules(dataRuleKeys));
 * ```
 * ```html
 * <ValidateEach v-for="(item, index) in array" :key="index" :state="item" :rules="rules" :rule-keys="ruleKeys" v-slot="{ v, models, errorMessages }">
 *    <!-- ValidateEach 組件將會覆蓋其組件之下的組件所inject的結果  -->
 *    <c-text-field model-key="email" required />
 *    <c-text-field model-key="nested.password" required />
 * </ValidateEach>
 * ```
 *
 * @param data
 * @param config
 * @returns 回傳傳入的keys對應的rules，$validator物件，依照rules生成的errorMessages
 */
export function useValidator<Key extends string, Data extends ValidatorModelValue>(
  _ruleKeys: UseValidatorRuleKeys<Key>,
  data: Data,
  config: ValidatorConfig<Key> = {},
) {
  const { provideToChild = true, convertedRuleKeys, convertedRules } = config;

  const ruleKeys = computed(() => unref(convertedRuleKeys) || getConvertedRuleKeys(_ruleKeys));
  const rules = computed(() => unref(convertedRules) || getValidatorRules(ruleKeys.value));
  const $validator = useVuelidate(rules, data, { $autoDirty: true });

  const $utils = computed(() => getValidatorUtils(ruleKeys.value, $validator.value));

  const disabled = computed(() => $validator.value.$invalid);
  // console.group("useValidator");
  // console.log("ruleKeys.value :>> ", ruleKeys.value);
  // console.log("rules.value :>> ", rules.value);
  // console.log("$validator.value :>> ", $validator.value);
  // console.log("$utils.value :>> ", $utils.value);
  // console.groupEnd();

  // watchEffect(() => {
  //   console.log("$validator.value :>> ", $validator.value);
  // });
  if (provideToChild) {
    provideValidator({ validator: $validator, utils: $utils, disabled });
  }

  return {
    rules,
    $validator,
    $utils,
    disabled,
  };
}
