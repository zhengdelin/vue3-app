<template>
  <slot v-bind="$utils" :v="$validator"></slot>
</template>
<script setup lang="ts">
import { ValidatorRules, ValidatorRuleKey, UnwrapUseValidatorRuleKeys } from "../types";
import { useValidator, provideValidatorForm, ValidatorModelValue } from "..";
import { useVDeepModel } from "@/composable/useVModel";
const props = withDefaults(
  defineProps<{
    modelValue: ValidatorModelValue;
    rules?: ValidatorRules<any>;
    ruleKeys?: UnwrapUseValidatorRuleKeys<string>;
    convertedRuleKeys?: ValidatorRuleKey<any>[];
  }>(),
  {},
);
const emit = defineEmits(["update:modelValue"]);
const modelV = useVDeepModel({ props, emit });
provideValidatorForm(modelV);
const rules = computed(() => props.rules);
const ruleKeys = computed(() => props.ruleKeys);
const convertedRuleKeys = computed(() => props.convertedRuleKeys);
const { $validator, $utils } = useValidator(ruleKeys as any, modelV, {
  convertedRuleKeys,
  convertedRules: rules,
});
</script>
