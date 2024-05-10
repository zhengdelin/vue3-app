import { createI18n, useI18n as _useI18n } from "vue-i18n";
import { App } from "vue";
import zh from "@/locales/zh";

export function installVueI18n(app: App) {
  const i18n = createI18n({
    legacy: false,
    locale: "zh",
    globalInjection: true,
    messages: {
      zh,
    },
    modifiers: {
      // capitalize:
    },
    missingWarn: false,
  });
  app.use(i18n);
  const tt = i18n.global.t;
  tt.s = (m, ...args) => tt(`sentences.${m}`, ...(args as []));
  tt.v = (m, ...args) => tt(`validations.${m}`, ...(args as []));
  tt.p = (m, ...args) => tt(`placeholders.${m}`, ...(args as []));
  return i18n;
}

export function useI18n() {
  const $i18n = _useI18n() as CustomVueI18n;
  // const { $i18n } = useNuxtApp();
  return {
    $i18n,
    $tt: $i18n.t,
  };
}

export function getLinkedPluralText(ctx: MessageContext, name: string, count: number) {
  const texts = Array.from({ length: count }).map((_, i) => {
    return ctx.linked(name, i + 1);
  });
  return ctx.plural(texts);
}
