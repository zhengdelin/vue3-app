//npm i @kyvg/vue3-notification
import Notifications, { notify } from "@kyvg/vue3-notification";
import { App } from "vue";

type NotifyType = typeof notify;
interface ExtendedNotify extends NotifyType {
  success(text: string, title?: string): void;
  error(text: string, title?: string): void;
}

export const $notify = notify as ExtendedNotify;
$notify.success = (text: string, title?: string) => notify({ type: "success", text, title });
$notify.error = (text: string, title?: string) => notify({ type: "error", text, title });

export function installNotifications(app: App) {
  app.use(Notifications);
}
