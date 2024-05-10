import { ValidatorModelValue } from "../types";
import { injectValidator } from "../useValidatorProvider";
import {
  DENSITY,
  DISABLED,
  FORM_MODEL,
  HIDE_LABEL,
  I18N_ARGS,
  DISPLAY_MODEL_KEY,
  KEYS,
  MODEL_KEY,
  READONLY,
  REQUIRED,
} from "./constants";
import {
  UseValidatorFormField,
  ValidatorFormConfig,
  ValidatorFormFieldBasicProps,
  ValidatorFormFieldProvider,
} from "./types";
import { useI18n } from "@/composable/useI18n";
import { useVModel, useVDeepModel, checkPropIsPassed } from "@/composable/useVModel";

function getDefaultModelValue<T extends ValidatorFormFieldBasicProps>(config: ValidatorFormConfig<T>, deep = false) {
  if (isDefined(config.defaultModelValue)) {
    return config.defaultModelValue;
  }
  return deep ? useVDeepModel(config) : useVModel(config);
}

export const injectValidatorForm = {
  model: () => inject(KEYS.FORM_MODEL, FORM_MODEL()),
};
export const injectValidatorFormField = {
  density: () => inject(KEYS.DENSITY, DENSITY),
  modelKey: () => inject(KEYS.MODEL_KEY, MODEL_KEY),
  displayModelKey: () => inject(KEYS.DISPLAY_MODEL_KEY, DISPLAY_MODEL_KEY),
  modelValue: () => inject(KEYS.MODEL_VALUE, undefined),
  i18nArgs: () => inject(KEYS.I18N_ARGS, I18N_ARGS),
  hideLabel: () => inject(KEYS.HIDE_LABEL, HIDE_LABEL),
  readonly: () => inject(KEYS.READONLY, READONLY),
  disabled: () => inject(KEYS.DISABLED, DISABLED),
  required: () => inject(KEYS.REQUIRED, REQUIRED),
};

const isDefined = <T>(v: T | undefined): v is T => v !== undefined;

export const useValidatorFormField: UseValidatorFormField = (config) => {
  const { props } = config;
  const modelResult = useValidatorFormField.model(config);
  const { displayModelKey, modelKey } = modelResult;

  const labelResult = useValidatorFormField.label(props, displayModelKey);
  const configResult = useValidatorFormField.config(props, modelKey);

  return Object.assign(modelResult, labelResult, configResult);
};

function getKey(fullKey: string) {
  const path = fullKey.toStringPath();
  return {
    fullKey,
    path,
    key: path[path.length - 1],
  };
}

useValidatorFormField.key = (props) => {
  const _modelKey = injectValidatorFormField.modelKey();
  const modelKey = computed(() => getKey(props.modelKey || _modelKey.value));
  const _i18nModelKey = injectValidatorFormField.displayModelKey();
  const displayModelKey = computed(() => {
    const _key = props.displayModelKey || _i18nModelKey.value;
    if (_key) {
      return getKey(_key);
    }
    return modelKey.value;
  });
  return {
    modelKey,
    displayModelKey,
  };
};
useValidatorFormField.model = (config) => {
  const { props } = config;
  const formModel = injectValidatorForm.model();

  // console.log("formModel :>> ", formModel);
  const keyResult = useValidatorFormField.key(props);
  const { modelKey } = keyResult;

  const isControlled = checkPropIsPassed(config);

  // const utilsModel = $utils.value.models[fullKey.value];
  const key = modelKey.value.fullKey;

  const modelV = (() => {
    const defaultModelValue = getDefaultModelValue(config);
    if (isControlled.value) {
      return defaultModelValue;
    }

    const injectModelV = injectValidatorFormField.modelValue();
    if (injectModelV && isDefined(injectModelV.value)) {
      // console.log("inject", injectModelV);
      return injectModelV;
    }

    // formModelV
    const formModelV = computed({
      get() {
        return Object.get(key, formModel.value);
      },
      set(v) {
        Object.set(key, formModel.value, v);
      },
    });
    return formModelV;
  })();

  return Object.assign(keyResult, {
    modelV,
  });
};
useValidatorFormField.label = (props, keys) => {
  const key = keys.value.key;
  const { $tt } = useI18n();
  const _i18nArgs = injectValidatorFormField.i18nArgs();
  const i18nArgs = computed(() => (props.i18nArgs || _i18nArgs.value) as []);

  const _hideLabel = injectValidatorFormField.hideLabel();
  const hideLabel = computed(() => props.hideLabel ?? _hideLabel.value);

  const label = computed(() => {
    if (hideLabel.value) return;
    return props.label ?? (key && $tt(key, ...i18nArgs.value, " ").trim());
  });

  const hidePlaceholder = computed(() => !!props.hidePlaceholder);
  const placeholder = computed(() => {
    if (hidePlaceholder.value) return;
    return props.placeholder ?? (key && $tt.p(key as any, ...i18nArgs.value, " ").trim());
  });

  return {
    i18nArgs,
    label,
    placeholder,
    hideLabel,
    hidePlaceholder,
  };
};
useValidatorFormField.config = (props, keys) => {
  const key = keys.value.fullKey;
  const $utils = injectValidator.utils();
  // 綁定錯誤訊息
  const errorMessages = computed(() => {
    if (props.errorMessages?.length) {
      return props.errorMessages;
    }

    if (!key) return "";
    return $utils.value.errorMessages[key];
  });

  const _density = injectValidatorFormField.density();
  const density = computed(() => props.density ?? _density.value);

  const _readonly = injectValidatorFormField.readonly();
  const readonly = computed(() => {
    if (props.readonly === true) return true;
    return _readonly.value;
  });

  const _disabled = injectValidatorFormField.disabled();
  const disabled = computed(() => {
    if (props.disabled === true) return true;
    return _disabled.value;
  });

  const _required = injectValidatorFormField.required();
  const required = computed(() => props.required ?? _required.value);

  return {
    errorMessages,
    density,
    readonly,
    disabled,
    required,
  };
};

export const provideValidatorFormField: ValidatorFormFieldProvider = (config) => {
  const { props } = config;
  provideValidatorFormField.modelValue(config);
  provideValidatorFormField.modelKey(props);
  provideValidatorFormField.displayModelKey(props);
  provideValidatorFormField.i18nArgs(props);

  provideValidatorFormField.hideLabel(props);

  provideValidatorFormField.density(props);

  provideValidatorFormField.readonly(props);
  provideValidatorFormField.disabled(props);
  provideValidatorFormField.required(props);
};
provideValidatorFormField.modelValue = (config) => {
  if (checkPropIsPassed(config).value) {
    const defaultModelValue = getDefaultModelValue(config);
    provide(KEYS.MODEL_VALUE, defaultModelValue);
  }
};
provideValidatorFormField.modelKey = (props) => {
  if (isDefined(props.modelKey)) {
    provide(
      KEYS.MODEL_KEY,
      computed(() => props.modelKey),
    );
  }
};
provideValidatorFormField.displayModelKey = (props) => {
  if (isDefined(props.displayModelKey)) {
    provide(
      KEYS.DISPLAY_MODEL_KEY,
      computed(() => props.displayModelKey),
    );
  }
};
provideValidatorFormField.hideLabel = (props) => {
  if (isDefined(props.hideLabel)) {
    provide(
      KEYS.HIDE_LABEL,
      computed(() => props.hideLabel),
    );
  }
};
provideValidatorFormField.i18nArgs = (props) => {
  if (isDefined(props.i18nArgs)) {
    provide(
      KEYS.I18N_ARGS,
      computed(() => props.i18nArgs),
    );
  }
};
provideValidatorFormField.density = (props) => {
  if (isDefined(props.density)) {
    provide(
      KEYS.DENSITY,
      computed(() => props.density),
    );
  }
};
provideValidatorFormField.readonly = (props) => {
  if (isDefined(props.readonly)) {
    provide(
      KEYS.READONLY,
      computed(() => props.readonly),
    );
  }
};
provideValidatorFormField.disabled = (props) => {
  if (isDefined(props.disabled)) {
    provide(
      KEYS.DISABLED,
      computed(() => props.disabled),
    );
  }
};
provideValidatorFormField.required = (props) => {
  if (isDefined(props.required)) {
    provide(
      KEYS.REQUIRED,
      computed(() => props.required),
    );
  }
};

export function provideValidatorForm<T extends ValidatorModelValue>(modelV: T | Ref<T>) {
  const obj = isRef(modelV) ? modelV : ref(modelV);
  if (obj) provide(KEYS.FORM_MODEL, obj);
}
