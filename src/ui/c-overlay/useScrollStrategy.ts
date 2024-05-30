import useToggleScope from "@/composable/useToggleScope";

export interface ScrollStrategyProps {
  scrollStrategy: keyof typeof scrollStrategies;
}

interface ScrollStrategyData {
  isActive: Ref<boolean>;
  target: Ref<HTMLElement | undefined>;
  contentEl: Ref<HTMLElement | undefined>;
  updateLocation: Ref<((e: Event) => void) | undefined>;
}

const scrollStrategies = {
  none: null,
  close: closeScrollStrategy,
  block: blockScrollStrategy,
};

export function useScrollStrategy(props: ScrollStrategyProps, data: ScrollStrategyData) {
  useToggleScope(
    () => !!data.isActive.value && !!props.scrollStrategy,
    () => {
      scrollStrategies[props.scrollStrategy]?.(data, props);
    },
  );
}

function closeScrollStrategy(data: ScrollStrategyData) {
  function onScroll() {
    data.isActive.value = false;
  }

  bindScroll(data.target.value ?? data.contentEl.value, onScroll);
}

function blockScrollStrategy(data: ScrollStrategyData, props: ScrollStrategyProps) {
  //
}

function bindScroll(el: HTMLElement | undefined, onScroll: (e: Event) => void) {
  const elements = [document, el];
  elements.forEach((el) => {
    el?.addEventListener("scroll", onScroll, { passive: true });
  });

  onScopeDispose(() => {
    elements.forEach((el) => {
      el?.removeEventListener("scroll", onScroll);
    });
  });
}
