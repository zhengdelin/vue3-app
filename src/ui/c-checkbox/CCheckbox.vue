<template>
  <label
    :for="id"
    :class="['c-checkbox', { 'is-active': isActive, 'is-disabled': isDisabled, 'is-readonly': isReadonly }]"
  >
    <div class="c-checkbox--body">
      <div :class="['c-checkbox--input']">
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
import { useVModel } from "@/composable/useVModel";
import { CHECKBOX_GROUP_INJECTION_KEY } from "../c-checkbox-group/useCheckboxGroup";

interface CheckboxProps {
  modelValue?: any;
  falseValue?: any;
  value?: any;
  label?: string;
  selectAll?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
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
  CHECKBOX_GROUP_INJECTION_KEY,
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
<style lang="scss">
.c-checkbox {
  $label-color: #000;
  $checkbox-inner-text-color: rgb(255, 255, 255);
  $checkbox-border-color: #3c4b68;
  $checkbox-background-color: transparent;

  --label-color: #{$label-color};
  --checkbox-inner-text-color: #{$checkbox-inner-text-color};
  --checkbox-border-color: #{$checkbox-border-color};
  --checkbox-background-color: #{$checkbox-background-color};

  // active
  --active-label-color: #{$label-color};
  --active-checkbox-inner-text-color: #{$checkbox-inner-text-color};
  --active-checkbox-border-color: #{$checkbox-border-color};
  --active-checkbox-background-color: var(--checkbox-border-color); // 保持與現在的border顏色一致

  // hover
  --hovered-label-color: var(--active-label-color);
  --hovered-checkbox-inner-text-color: var(--active-checkbox-inner-text-color);
  --hovered-checkbox-border-color: var(--active-checkbox-border-color);
  --hovered-checkbox-background-color: #{$checkbox-background-color};

  // disabled
  --disabled-label-color: rgb(209, 213, 219);
  --disabled-checkbox-border-color: rgb(209, 213, 219);
  --disabled-checkbox-inner-text-color: rgb(247, 224, 224);
  --disabled-checkbox-background-color: #{$checkbox-background-color};
  --disabled-active-checkbox-inner-text-color: #{$checkbox-inner-text-color};
  --disabled-active-checkbox-background-color: var(--checkbox-border-color); // 保持與現在的border顏色一致

  // readonly
  --readonly-label-color: #{$label-color};
  --readonly-checkbox-border-color: #{$checkbox-border-color};
  --readonly-checkbox-inner-text-color: #{$checkbox-inner-text-color};
  --readonly-checkbox-background-color: #{$checkbox-background-color};
  --readonly-active-checkbox-inner-text-color: var(--active-checkbox-inner-text-color);
  --readonly-active-checkbox-background-color: var(--checkbox-border-color); // 保持與現在的border顏色一致
}

@mixin set-color($label, $checkbox-inner-text, $checkbox-border, $checkbox-background) {
  .c-checkbox {
    color: $label;
    &--input {
      input {
        border-color: $checkbox-border;
        background-color: $checkbox-background;
      }
      .inner {
        color: $checkbox-inner-text;
      }
    }
  }
}

.c-checkbox {
  --checkbox-size: 20px;
  --gap: 6px;

  display: flex;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  // color: var(--label-color);
  @include set-color(
    var(--label-color),
    var(--checkbox-inner-text-color),
    var(--checkbox-border-color),
    var(--checkbox-background-color)
  );

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
      border-width: 2px;
      border-style: solid;
      // border: 2px solid var(--checkbox-border-color);
      // background-color: var(--checkbox-background-color);
      appearance: none;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
      border-radius: inherit;
      margin: 0;
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
      // color: var(--checkbox-inner-text-color);
    }
  }

  &:hover {
    @include set-color(
      var(--hovered-label-color),
      var(--hovered-checkbox-inner-text-color),
      var(--hovered-checkbox-border-color),
      var(--hovered-checkbox-background-color)
    );
    // --label-color: var(--hovered-label-color);
    // --checkbox-inner-text-color: var(--hovered-checkbox-inner-text-color);
    // --checkbox-border-color: var(--hovered-checkbox-border-color);
    // --checkbox-background-color: var(--hovered-checkbox-background-color);
  }

  &.is-active {
    .inner {
      display: flex;
    }

    @include set-color(
      var(--active-label-color),
      var(--active-checkbox-inner-text-color),
      var(--active-checkbox-border-color),
      var(--active-checkbox-background-color)
    );
    // --label-color: var(--active-label-color);
    // --checkbox-inner-text-color: var(--active-checkbox-inner-text-color);
    // --checkbox-border-color: var(--active-checkbox-border-color);
    // --checkbox-background-color: var(--active-checkbox-background-color);
  }

  &.is-readonly {
    @include set-color(
      var(--readonly-label-color),
      var(--readonly-checkbox-inner-text-color),
      var(--readonly-checkbox-border-color),
      var(--readonly-checkbox-background-color)
    );
    &.is-active {
      @include set-color(
        var(--readonly-label-color),
        var(--readonly-active-checkbox-inner-text-color),
        var(--readonly-checkbox-border-color),
        var(--readonly-active-checkbox-background-color)
      );
    }
    // --label-color: var(--readonly-label-color);
    // --checkbox-inner-text-color: var(--readonly-checkbox-inner-text-color);
    // --checkbox-border-color: var(--readonly-border-color);
    // --checkbox-background-color: var(--readonly-checkbox-background-color);
    // &.is-active {
    //   --checkbox-inner-text-color: var(--readonly-active-checkbox-inner-text-color);
    //   --checkbox-background-color: var(--readonly-active-checkbox-background-color);
    // }
  }

  &.is-disabled {
    pointer-events: none;
    @include set-color(
      var(--disabled-label-color),
      var(--disabled-checkbox-inner-text-color),
      var(--disabled-checkbox-border-color),
      var(--disabled-checkbox-background-color)
    );
    &.is-active {
      @include set-color(
        var(--disabled-label-color),
        var(--disabled-active-checkbox-inner-text-color),
        var(--disabled-checkbox-border-color),
        var(--disabled-active-checkbox-background-color)
      );
    }
    // --label-color: var(--disabled-label-color);
    // --checkbox-inner-text-color: var(--disabled-checkbox-inner-text-color);
    // --checkbox-border-color: var(--disabled-border-color);
    // --checkbox-background-color: var(--disabled-checkbox-background-color);
    // &.is-active {
    //   --checkbox-inner-text-color: var(--disabled-active-checkbox-inner-text-color);
    //   --checkbox-background-color: var(--disabled-active-checkbox-background-color);
    // }
  }
}
</style>
