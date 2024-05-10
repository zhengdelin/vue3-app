interface ActivatorProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  target?: "parent" | "cursor" | (string & {}) | Element | [x: number, y: number];
  // eslint-disable-next-line @typescript-eslint/ban-types
  activator?: "parent" | (string & {}) | Element;
  activatorProps?: Record<string, any>;

  openOnClick?: boolean;
  openOnHover?: boolean;
  openOnFocus?: boolean;
  closeOnContentClick?: boolean;
}

const ACTIVATOR_PROPS_DEFAULT: ActivatorProps = {
  target: undefined,
  activator: undefined,
  activatorProps: undefined,
  openOnClick: undefined,
  openOnHover: false,
  openOnFocus: undefined,
  closeOnContentClick: false,
};

export function useActivator(props: ActivatorProps, { isActive }: { isActive: Ref<boolean> }) {
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

  const cursorTarget = ref<[x: number, y: number]>();
  const availableEvents = {
    onClick(e: MouseEvent) {
      e.stopPropagation();
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      if (!isActive.value) {
        cursorTarget.value = [e.clientX, e.clientY];
      }
      isActive.value = !isActive.value;
    },
    onMouseenter(e: MouseEvent) {
      isHovered = true;
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      runOpen();
    },
    onMouseleave(e: MouseEvent) {
      isHovered = false;
      runClose();
    },
    onFocus(e: FocusEvent) {
      if (!(e.target as HTMLElement).matches(":focus-visible")) return;
      isFocused = true;
      e.stopPropagation();
      activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
      runOpen();
    },
    onBlur(e: FocusEvent) {
      isFocused = false;
      e.stopPropagation();
      runClose();
    },
  };

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

  const activatorRef = ref<HTMLElement>();
}
