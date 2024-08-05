export interface LazyProps {
  eager?: boolean;
}

export function useLazy(props: LazyProps, isActive: Ref<boolean>) {
  const isBooted = shallowRef(false);
  const hasContent = computed(() => isBooted.value || props.eager || isActive.value);

  watch(isActive, () => (isBooted.value = true));
  // watchEffect(() => {
  //   console.log("isActive.value :>> ", isActive.value);
  // });
  /**
   * 動畫結束後關閉
   */
  function onAfterLeave() {
    if (!props.eager) isBooted.value = false;
  }

  return { isBooted, hasContent, onAfterLeave };
}
