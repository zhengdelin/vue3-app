import { CursorEl } from "./useActivator";

interface LocationStrategyData {
  isActive: Ref<boolean>;
  target: Ref<HTMLElement | CursorEl | undefined>;
  contentEl: Ref<HTMLElement | undefined>;
}

interface LocationStrategyProps {}

export function useLocationStrategy(props: any, data: LocationStrategyData) {
  const { isActive, target, contentEl } = data;
  const contentStyles = ref({});
  const updateLocation = ref<(e: Event) => void>();

  watchEffect(() => {
    if (!isActive.value) return;
    // const targetRect = target.value?
    if (!Array.isArray(target.value)) {
      const targetRect = target.value?.getBoundingClientRect();
      console.log("🚀 ~ watchEffect ~ targetRect:", target.value, targetRect);
    }
    const contentRect = contentEl.value?.getBoundingClientRect();
    console.log("🚀 ~ nextTick ~ contentRect:", contentEl.value, contentRect);
  });

  function onResize(e: Event) {
    updateLocation.value?.(e);
  }
}
