import { ValidatorProvider, ValidatorUtilsProvider, ValidatorDisabled } from "../types";
import { KEYS, VALIDATOR, VALIDATOR_DISABLED, VALIDATOR_UTILS } from "./constants";

export const injectValidator = () => inject(KEYS.VALIDATOR, VALIDATOR);
injectValidator.utils = () => inject(KEYS.VALIDATOR_UTILS, VALIDATOR_UTILS);
injectValidator.disabled = () => inject(KEYS.VALIDATOR_DISABLED, VALIDATOR_DISABLED);

export function provideValidator({
  validator,
  utils,
  disabled,
}: {
  validator: ValidatorProvider;
  utils: ValidatorUtilsProvider;
  disabled: ValidatorDisabled;
}) {
  provide(KEYS.VALIDATOR, validator);
  provide(KEYS.VALIDATOR_UTILS, utils);
  provide(KEYS.VALIDATOR_DISABLED, disabled);
}
