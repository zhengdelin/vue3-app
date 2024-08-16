import { App, Directive } from "vue";

type ClickOutsideBinding =
  | {
      handler: (e: Event) => void;
      include: () => HTMLElement[];
    }
  | ((e: Event) => void);

const CLICK_OUTSIDE_UNMOUNT = Symbol("CLICK_OUTSIDE_UNMOUNT");

function useClickOutside(el: HTMLElement, binding: ClickOutsideBinding) {
  const _handler = typeof binding === "function" ? binding : binding.handler;
  const include = typeof binding === "function" ? () => [] : binding.include || (() => []);
  const handler = (e: any) => {
    // console.log(
    //   "e :>> ",
    //   el.contains(e.target),
    //   e.defaultPrevented,
    //   include?.().every((el) => !el.contains(e.target)),
    //   !el.contains(e.target) && !e.defaultPrevented && include().every((el) => !el.contains(e.target)),
    // );
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

/**
 * 開發紀錄 20240817:
 * 記得要觸發 unmount 取消監聽 handler 否則會一直重複觸發
 */
const clickOutsideDirective: Directive<HTMLElement, ClickOutsideBinding> = {
  mounted(el, binding) {
    const unmounted = useClickOutside(el, binding.value);
    (el as any)[CLICK_OUTSIDE_UNMOUNT] = unmounted;
  },
  unmounted(el) {
    (el as any)[CLICK_OUTSIDE_UNMOUNT]();
  },
};

export default useClickOutside;
