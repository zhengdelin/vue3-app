import { ComponentInternalInstance, ComponentPublicInstance } from "vue";
import { refElement } from "../utils/helpers";
import { Point } from "./types";

export type CursorEl = Point;
// eslint-disable-next-line @typescript-eslint/ban-types
type ActivatorActivator = "parent" | (string & {}) | Element | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
type ActivatorTarget = "parent" | "cursor" | (string & {}) | Element | CursorEl | undefined;
export interface ActivatorProps {
  target?: ActivatorTarget;
  activator?: ActivatorActivator;
  activatorProps?: Record<string, any>;

  openOnClick?: boolean;
  openOnHover?: boolean;
  openOnFocus?: boolean;
  closeOnContentClick?: boolean;
}

export const ACTIVATOR_PROPS_DEFAULT = {
  // target: undefined,
  // activator: undefined,
  // activatorProps: undefined,
  openOnClick: undefined,
  openOnHover: false,
  openOnFocus: undefined,
  closeOnContentClick: false,
};

export function useActivator(props: ActivatorProps, { isActive }: { isActive: Ref<boolean> }) {
  const vm = getCurrentInstance();
  console.log("🚀 ~ useActivator ~ vm:", props, vm);
  const activatorEl = ref<HTMLElement>();

  let isHovered = false;
  let isFocused = false;

  const openOnFocus = computed(() => props.openOnFocus);
  const openOnClick = computed(() => props.openOnClick);

  const runOpen = () => {
    if ((props.openOnHover && isHovered) || (openOnFocus.value && isFocused)) {
      isActive.value = true;
    }
  };

  const runClose = () => {
    isActive.value = false;
  };

  const cursorTarget = ref<CursorEl>();
  const availableEvents = {
    onClick(e: MouseEvent) {
      console.log("onClick", e, e.target);
      e.stopPropagation();
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      if (!isActive.value) {
        cursorTarget.value = [e.clientX, e.clientY];
      }
      isActive.value = !isActive.value;
    },
    onMouseenter(e: MouseEvent) {
      console.log("onMouseenter", e, e.target);
      isHovered = true;
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      runOpen();
    },
    onMouseleave(e: MouseEvent) {
      console.log("onMouseleave", e, e.target);
      isHovered = false;
      runClose();
    },
    onFocus(e: FocusEvent) {
      console.log("onFocus", e, e.target);
      if (!(e.target as HTMLElement).matches(":focus-visible")) return;
      isFocused = true;
      e.stopPropagation();
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      runOpen();
    },
    onBlur(e: FocusEvent) {
      console.log("enBlur", e, e.target);
      isFocused = false;
      e.stopPropagation();
      runClose();
    },
  };

  // 依照props 篩選 觸發器 用到的事件
  const activatorEvents = computed(() => {
    const events = {} as Partial<typeof availableEvents>;
    if (openOnClick.value) {
      events.onClick = availableEvents.onClick;
    }
    if (props.openOnHover) {
      events.onMouseenter = availableEvents.onMouseenter;
      events.onMouseleave = availableEvents.onMouseleave;
    }

    if (openOnFocus.value) {
      events.onFocus = availableEvents.onFocus;
      events.onBlur = availableEvents.onBlur;
    }

    return events;
  });

  // 依照props 篩選 Overlay content 用到的事件
  const contentEvents = computed(() => {
    const events = {} as Record<string, EventListener>;

    if (props.openOnHover) {
      events.onMouseenter = () => {
        isHovered = true;
        runOpen();
      };

      events.onMouseleave = () => {
        isHovered = false;
        runClose();
      };
    }

    if (openOnFocus.value) {
      events.onFocusin = () => {
        isFocused = true;
        runOpen();
      };
      events.onFocusout = () => {
        isFocused = false;
        runClose();
      };
    }

    if (props.closeOnContentClick) {
      events.onClick = () => {
        isActive.value = false;
      };
    }

    return events;
  });

  const scrimEvents = computed(() => {
    const events = {} as Record<string, EventListener>;

    if (props.openOnHover) {
      events.onMouseenter = () => {
        isHovered = true;
        runOpen();
      };

      events.onMouseleave = () => {
        isHovered = false;
        runClose();
      };
    }
    return events;
  });

  // 當 Overlay 隱藏時，清除 cursorTarget
  watch(
    isActive,
    (val) => {
      if (!val) {
        setTimeout(() => {
          cursorTarget.value = undefined;
        });
      }
    },
    { flush: "post" },
  );

  // 綁定 activator VNode
  const activatorRef = ref<HTMLElement>();

  // 當 activator VNode 發生變化時，更新 activator HTMLElement
  watchEffect(() => {
    if (!activatorRef.value) {
      return;
    }

    nextTick(() => {
      activatorEl.value = refElement(activatorRef.value);
    });
  });

  // 手動綁定 target VNode
  const targetRef = ref<HTMLElement | ComponentPublicInstance<any>>();
  const target = computed(() => {
    if (props.target === "cursor" && cursorTarget.value) {
      return cursorTarget.value;
    }
    // 如果有綁定 target VNode，直接回傳 VNode 的 HTMLElement
    if (targetRef.value) return refElement(targetRef.value);

    // 依照selector 取得 target HTMLElement，若沒有表示 target 為 activator
    return getTarget(props.target, vm) || activatorEl.value;
  });
  const targetEl = computed(() => {
    return Array.isArray(target.value) ? undefined : target.value;
  });

  return {
    activatorEl,
    activatorRef,
    target,
    targetEl,
    targetRef,
    activatorEvents,
    contentEvents,
    scrimEvents,
  };
}

/**
 * Retrieves the target element based on the selector provided.
 *
 * @param {T} selector - The selector to identify the target element.
 * @param {ComponentInternalInstance | null} vm - The component instance or null.
 * @return {HTMLElement | undefined | (T extends any[] ? CursorEl : never)} The target element matching the selector.
 */
function getTarget<T extends Exclude<ActivatorTarget, "cursor">>(
  selector: T,
  vm: ComponentInternalInstance | null,
): HTMLElement | undefined | (T extends any[] ? CursorEl : never) {
  if (!selector) return;

  let target;
  if (selector === "parent") {
    // parent
    let el = vm?.proxy?.$el?.parentNode;
    while (el?.hasAttribute("data-no-activator")) {
      el = el.parentNode;
    }
    target = el;
  } else if (typeof selector === "string") {
    // selector dom 元素
    target = document.querySelector(selector);
  } else if ("$el" in selector) {
    target = selector.$el;
  } else {
    target = selector;
  }

  return target;
}
