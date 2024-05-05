<template>
  <label
    :for="id"
    :class="['checkbox', { 'is-active': isActive, 'is-disabled': isDisabled, 'is-readonly': isReadonly }]"
  >
    <div class="checkbox--body">
      <div :class="['checkbox--input']">
        <input :id="id" v-model="modelValue" :disabled="isReadonly || isDisabled" type="checkbox" :value="value" />
        <slot name="inner">
          <span class="inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>
          </span>
        </slot>
      </div>
      <slot>
        <span v-if="isLabeled" class="label">
          <slot>{{ label }}</slot>
        </span>
      </slot>
    </div>
  </label>
</template>
<script setup lang="ts">
import { useVModel } from "@/composables/useVModel";
import { CHECKBOX_INJECTION_KEY } from "./constants";

interface InputCheckbox {
  modelValue?: any;
  falseValue?: any;
  value?: any;
  label?: string;
  selectAll?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<InputCheckbox>(), {
  falseValue: false,
  value: true,
  selectAll: false,
  label: "",
  readonly: undefined,
  disabled: undefined,
});

const { value, falseValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();

const isLabeled = computed(() => !!props.label || !!slots.default);

const instance = getCurrentInstance();
const id = computed(() => `checkbox-${instance?.uid}`);

const injection = inject(
  CHECKBOX_INJECTION_KEY,
  () => ({
    modelValue: useVModel({ props, emit, propName: "modelValue" }),
    disabled: computed(() => false),
    readonly: computed(() => false),
    childrenCount: computed(() => 0),
    children: [],
    isAllSelected: computed(() => false),
    registerChild: () => () => {
      //
    },
    selectAll: () => {
      //
    },
    unselectAll: () => {
      //
    },
    toggleSelectAll: () => false,
  }),
  true,
);

const { modelValue: outerModelValue, childrenCount } = injection;

const isReadonly = computed(() => props.readonly ?? injection.readonly.value);
const isDisabled = computed(() => props.disabled ?? injection.disabled.value);
const isMultipleCheckbox = computed(() => childrenCount.value > 1 || outerModelValue.value instanceof Array);

const { isActive, modelValue } = (() => {
  if (props.selectAll) {
    const isActive = computed(() => injection.isAllSelected.value);
    return {
      isActive,
      modelValue: computed({
        get() {
          return isActive.value;
        },
        set() {
          injection.toggleSelectAll();
        },
      }),
    };
  }

  const isActive = computed(() =>
    isMultipleCheckbox.value
      ? (outerModelValue.value as any[])?.includes(value.value)
      : outerModelValue.value === value.value,
  );
  return {
    isActive,
    modelValue: computed({
      get() {
        return isActive.value;
      },
      set(v: boolean) {
        if (v === isActive.value) return;
        if (isMultipleCheckbox.value) {
          if (v) {
            outerModelValue.value.push(value.value);
          } else {
            outerModelValue.value = outerModelValue.value.filter((item: any) => item !== value.value);
          }
          return;
        }
        outerModelValue.value = v ? value.value : falseValue.value;
      },
    }),
  };
})();

injection.registerChild({
  active: isActive,
  selectAll: props.selectAll,
  value,
});
</script>
<style scoped lang="scss">
.checkbox {
  $label-color: #000;
  $inner-color: rgb(255, 255, 255);
  $border-color: #3c4b68;
  $background-color: transparent;

  --label-color: #{$label-color};
  --inner-color: #{$inner-color};
  --border-color: #{$border-color};
  --background-color: #{$background-color};

  // active
  --active-label-color: #{$label-color};
  --active-inner-color: #{$inner-color};
  --active-border-color: #{$border-color};
  --active-background-color: var(--border-color); // 保持與現在的border顏色一致

  // hover
  --hovered-label-color: var(--active-label-color);
  --hovered-inner-color: var(--active-inner-color);
  --hovered-border-color: var(--active-border-color);
  --hovered-background-color: #{$background-color};

  // disabled
  --disabled-label-color: rgb(209, 213, 219);
  --disabled-border-color: rgb(209, 213, 219);
  --disabled-inner-color: rgb(247, 224, 224);
  --disabled-background-color: #{$background-color};
  --disabled-active-inner-color: #{$inner-color};
  --disabled-active-background-color: var(--border-color); // 保持與現在的border顏色一致

  // readonly
  --readonly-label-color: #{$label-color};
  --readonly-border-color: #{$border-color};
  --readonly-inner-color: #{$inner-color};
  --readonly-background-color: #{$background-color};
  --readonly-active-inner-color: var(--active-inner-color);
  --readonly-active-background-color: var(--border-color); // 保持與現在的border顏色一致
}
.checkbox {
  --checkbox-size: 20px;
  --gap: 6px;

  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  color: var(--label-color);
  display: flex;

  &--body {
    display: flex;
    align-items: center;
    gap: var(--gap);
    text-align: center;
    // height: 24px;
  }

  &--input {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 2px;

    input,
    .inner {
      width: var(--checkbox-size);
      height: var(--checkbox-size);
    }

    input {
      cursor: pointer;
      position: relative;
      outline: none;
      border: 2px solid var(--border-color);
      background-color: var(--background-color);
      appearance: none;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
      border-radius: inherit;
    }

    .inner {
      display: none;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 2px;
      color: var(--inner-color);
    }
  }

  &:hover {
    --label-color: var(--hovered-label-color);
    --inner-color: var(--hovered-inner-color);
    --border-color: var(--hovered-border-color);
    --background-color: var(--hovered-background-color);
  }

  &.is-active {
    .inner {
      display: flex;
    }
    --label-color: var(--active-label-color);
    --inner-color: var(--active-inner-color);
    --border-color: var(--active-border-color);
    --background-color: var(--active-background-color);
  }

  &.is-readonly {
    --label-color: var(--readonly-label-color);
    --inner-color: var(--readonly-inner-color);
    --border-color: var(--readonly-border-color);
    --background-color: var(--readonly-background-color);
    &.is-active {
      --inner-color: var(--readonly-active-inner-color);
      --background-color: var(--readonly-active-background-color);
    }
  }

  &.is-disabled {
    pointer-events: none;
    --label-color: var(--disabled-label-color);
    --inner-color: var(--disabled-inner-color);
    --border-color: var(--disabled-border-color);
    --background-color: var(--disabled-background-color);
    &.is-active {
      --inner-color: var(--disabled-active-inner-color);
      --background-color: var(--disabled-active-background-color);
    }
  }
}
</style>
