export type InputControlEmits = {
  (e: "click:prepend-inner"): void;
  (e: "click:append-inner"): void;
  (e: "clear"): void;
};

export interface InputControlProps {
  label?: string;
  required?: boolean;

  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  alwaysFocus?: boolean;
  focus?: boolean;
  active?: boolean;

  bordered?: boolean;
}
const INPUT_CONTROL_SLOTS = ["prepend-inner", "append-inner"] as const;
export type InputControlSlots = (typeof INPUT_CONTROL_SLOTS)[number];

export const INPUT_CONTROL_PROPS_DEFAULT = {
  label: "",
  required: false,
  clearable: true,
  readonly: false,
  disabled: false,
  alwaysFocus: false,
  focus: false,
  bordered: true,
  active: false,
} as InputControlProps;

export function createEmitEvents(emit: InputControlEmits) {
  const onPrependInnerClick = () => emit("click:prepend-inner");
  const onAppendInnerClick = () => emit("click:append-inner");
  const onClear = () => emit("clear");
  return {
    "onClick:prepend-inner": onPrependInnerClick,
    "onClick:append-inner": onAppendInnerClick,
    onClear: onClear,
  };
}

export function createInputControlContext(props: InputControlProps, emit: InputControlEmits, slots: any) {
  function createProps(props: InputControlProps): ComputedRef<InputControlProps> {
    return computed(() =>
      Object.keys(INPUT_CONTROL_PROPS_DEFAULT).reduce((prev, key) => {
        prev[key] = props[key as keyof InputControlProps];
        return prev;
      }, {} as any),
    );
  }

  function createSlots(slots: any) {
    const s = {} as {
      "prepend-inner"?: () => VNode;
      "append-inner"?: () => VNode;
    };
    slots["prepend-inner"] && (s["prepend-inner"] = slots["prepend-inner"]);
    slots["append-inner"] && (s["append-inner"] = slots["append-inner"]);
    return s;
  }

  return { props: createProps(props), emitEvents: createEmitEvents(emit), slots: createSlots(slots) };
}
