import * as v from "@vuelidate/validators";
import { UnwrapRef } from "vue";
import { useI18n } from "@/composable/useI18n";
import { MessageKeys } from "@/locales/zh";
type UnRefs<T extends object> = { [K in keyof T]: UnwrapRef<T[K]> };
function unrefs<T extends object>(obj: T) {
  return Object.entries(obj).reduce((prev, [key, v]) => {
    prev[key as keyof T] = unref(v);
    return prev;
  }, {} as UnRefs<T>);
}

function createI18nValidators() {
  const { $i18n, $tt } = useI18n();
  const withI18nMessage = v.createI18nMessage({ t: $i18n.t.bind($i18n) });
  return {
    sameAs: function <T extends object, K>(
      getTarget: (data: UnRefs<T>) => K,
      message?: (targetV: K, i18n: typeof $tt) => string,
    ) {
      return function (curV: unknown, data: T) {
        const targetV = getTarget(unrefs(data));
        const $valid = curV === targetV;
        return {
          $valid,
          $message: message ? message(targetV, $tt) : $tt.v("theSameAs", { value: targetV }),
        };
      };
    },
    required: withI18nMessage(v.required),
    email: withI18nMessage(v.email),
    minLength: withI18nMessage(v.minLength, { withArguments: true }),
    maxLength: withI18nMessage(v.maxLength, { withArguments: true }),
    regex: function (param: string, pattern: string | RegExp) {
      const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
      return function (curV: string | number) {
        // console.log("arguments :>> ", arguments);
        const $valid = regex.test(curV.toString());
        return {
          $valid,
          $message: $tt.v("regex", { property: param }),
        };
      };
    },
    numeric: withI18nMessage(v.numeric),
  };
}

const validators = computed(() => createI18nValidators());

export type AllValidators = ReturnType<typeof createI18nValidators>;
export default validators;
export const defineRulesWithValidators = <T>(callback: (validators: AllValidators) => T): T => {
  return callback(validators.value);
};

export function withI18nMessageValidator(
  validator: any,
  { property, args: i18nArgs = [] }: { property?: MessageKeys; args?: unknown[] },
) {
  return v.helpers.withMessage((ctx) => {
    property ||= ctx.$property as MessageKeys;
    const { $tt } = useI18n();
    return $tt.v(ctx.$validator as any, { property }, ...i18nArgs);
  }, validator);
}
