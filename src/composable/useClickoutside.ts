import { App, Directive } from "vue";

type ClickOutsideBinding =
  | {
      handler: (e: Event) => void;
      include: () => HTMLElement[];
    }
  | ((e: Event) => void);

function useClickOutside(el: HTMLElement, binding: ClickOutsideBinding) {
  const _handler = typeof binding === "function" ? binding : binding.handler;
  const include = typeof binding === "function" ? () => [] : binding.include;
  const handler = (e: any) => {
    if (!el.contains(e.target) && !e.defaultPrevented && include().every((el) => !el.contains(e.target))) {
      _handler(e);
    }
  };
  document.addEventListener("click", handler);
  document.addEventListener("touchstart", handler);
  return () => {
    document.removeEventListener("click", handler);
    document.removeEventListener("touchstart", handler);
  };
}

useClickOutside.install = (app: App) => {
  app.directive("click-outside", clickOutsideDirective);
};

const clickOutsideDirective: Directive<HTMLElement, ClickOutsideBinding> = (el, binding) => {
  const unmounted = useClickOutside(el, binding.value);
  return {
    unmounted,
  };
};

export default useClickOutside;
