import { createApp } from "vue";
import "@/assets/styles/app.scss";
import App from "./App.vue";
import { installPinia } from "./store";
import { setupDebounceThrottleDirectives } from "@/composables/useDebounceThrottle";
import { installRouter } from "./router";
import "@/plugins/prototypes/index";
import { setupLoading } from "./composables/useLoading";
import { installVueI18n } from "./composables/useI18n";
import useValidationForm from "./composables/useValidationForm";
const app = createApp(App);

setupLoading(app);
installPinia(app);
installRouter(app);
setupDebounceThrottleDirectives(app);
installVueI18n(app);
app.use(useValidationForm, {
  textField: defineAsyncComponent(() => import("@/components/input/TextField.vue")),
  radioGroup: defineAsyncComponent(() => import("@/components/input/RadioGroup.vue")),
  radio: defineAsyncComponent(() => import("@/components/input/Radio.vue")),
});
app.mount("#app");
