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

export type InputControlSlots = "prepend-inner" | "append-inner";
