import { INPUT_CONTROL_PROPS_DEFAULT } from "./constants";
import { InputControlEmits, InputControlProps } from "./types";

function createEmitEvents(emit: InputControlEmits) {
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

export { createEmitEvents as createInputControlEmitEvents };
