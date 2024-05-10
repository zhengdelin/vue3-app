export interface UseMessageConfig {
  text: string;
  type: "error" | "warning" | "success" | "info";
}

export interface UseMessage {
  (config: UseMessageConfig): void;
  success(text: UseMessageConfig["text"]): void;
  error(text: UseMessageConfig["text"]): void;
  warning(text: UseMessageConfig["text"]): void;
  info(text: UseMessageConfig["text"]): void;
}
