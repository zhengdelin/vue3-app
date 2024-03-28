import { MessageFunctionCallable } from "@intlify/core-base";
import { MessageKeys, MessageSchema } from "@/locales/zh";
export {};

type _MessageContext<T> = Parameters<MessageFunctionCallable>[0];
declare global {
  import { useI18n } from "vue-i18n";
  interface MessageContext extends _MessageContext<string> {
    list(index: number): string;
    named(key: string): string;
    linked(key: string, modifier?: string): string;
    linked(key: string, modifier?: string, type?: string): string;
    linked(key: string, options?: LinkedOptions): string;
  }

  type CustomVueI18n = ReturnType<
    typeof useI18n<
      {
        zh: MessageSchema;
      },
      "zh",
      {
        messages: {
          zh: MessageSchema;
        };
        locale: "zh";
      }
    >
  >;
}

type PickupMessageKey<T extends string, K> = K extends `${T}.${infer P}` ? P : never;
type ValidationMessage = PickupMessageKey<"validations", MessageKeys>;
type SentenceMessage = PickupMessageKey<"sentences", MessageKeys>;
type PlaceholderMessage = PickupMessageKey<"placeholders", MessageKeys>;
declare module "vue-i18n" {
  interface ComposerTranslation {
    /**
     * get sentence translations
     * @param m
     * @param args
     */
    s(m: SentenceMessage, ...args: unknown[]): string;

    /**
     * get validation translations
     * @param m
     * @param args
     */
    v(m: ValidationMessage, ...args: unknown[]): string;

    /**
     * get placeholder translations
     * @param m
     * @param args
     */
    p(m: PlaceholderMessage, ...args: unknown[]): string;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $tt: CustomVueI18n["t"];
  }
}
