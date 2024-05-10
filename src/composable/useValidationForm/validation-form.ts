type Component = globalThis.Component;
export type RegisteredComps = Record<string, Component>;

declare module "vue" {
  // Validation Form Comp
  interface GlobalComponents {
    ValidationForm: typeof import("./components/ValidationForm").default;
  }
}

export interface FormItem {
  as?: string | Component;
  prop?: string;

  //   common props
  label?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  props?: Record<string, any>;
  slotItems?: FormItem[] | Record<string, FormItem[]>;
  // children?: FormItem[];
}
