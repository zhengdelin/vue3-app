export interface InputContainerProps {
  size?: "large" | "medium" | "small";
  error?: boolean;
  errorMessage?: string;
  height?: string;
  width?: string;
}

export interface InputContainerEmits {
  (e: "click:prepend"): void;
  (e: "click:append"): void;
}

export type InputContainerSlots = "prepend" | "append";

export const INPUT_CONTAINER_PROPS_DEFAULT = {
  size: "medium",
  error: false,
  errorMessage: "",
  height: undefined,
  width: undefined,
} as InputContainerProps;

export function createEmitEvents(emit: InputContainerEmits) {
  const onAppendClick = () => emit("click:append");
  const onPrependClick = () => emit("click:prepend");
  return {
    "onClick:append": onAppendClick,
    "onClick:prepend": onPrependClick,
  };
}

export function createInputContainerContext(props: InputContainerProps, emit: InputContainerEmits, slots: any) {
  function createProps(props: InputContainerProps): ComputedRef<InputContainerProps> {
    return computed(() =>
      Object.keys(INPUT_CONTAINER_PROPS_DEFAULT).reduce((prev, key) => {
        prev[key] = props[key as keyof InputContainerProps];
        return prev;
      }, {} as any),
    );
  }

  function createSlots(slots: any) {
    const s = {} as {
      prepend?: () => VNode[];
      append?: () => VNode[];
    };
    slots.append && (s.append = slots.append);
    slots.prepend && (s.prepend = slots.prepend);
    return s;
  }

  return {
    props: createProps(props),
    emitEvents: createEmitEvents(emit),
    slots: createSlots(slots),
  };
}
