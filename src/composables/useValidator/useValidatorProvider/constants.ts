import useVuelidate from "@vuelidate/core";
import { ValidatorDisabled, ValidatorProvider, ValidatorUtils, ValidatorUtilsProvider } from "../types";

export const KEYS = {
  VALIDATOR: Symbol("validator"),
  VALIDATOR_UTILS: Symbol("validator utils"),
  VALIDATOR_DISABLED: Symbol("validator disabled"),
};
export const VALIDATOR: ValidatorProvider = useVuelidate();
export const VALIDATOR_UTILS: ValidatorUtilsProvider = computed(() => {
  return {
    errorMessages: {},
    models: {},
    invalids: {},
  } as ValidatorUtils;
});
export const VALIDATOR_DISABLED: ValidatorDisabled = computed(() => false);
