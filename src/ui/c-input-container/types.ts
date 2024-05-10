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
