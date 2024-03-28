export default <T>(val: MaybeRef<T>) => {
  const getVal = () => unref(val);
  const defaultValue = ref(Object.deepClone(getVal()));

  function refreshDefault(newDefaultValue: T) {
    defaultValue.value = Object.deepClone(newDefaultValue) as any;
  }

  function resetToDefault(handler: (clonedDefaultValue: T) => void) {
    handler(Object.deepClone(defaultValue.value) as T);
  }

  const isValueChanged = computed(() => {
    return !Object.isEqual(getVal(), defaultValue.value);
  });

  return {
    defaultValue,
    refreshDefault,
    resetToDefault,
    isValueChanged,
  };
};
