import "@/assets/styles/app.scss";
import { setupDebounceThrottleDirectives } from "@/composable/useDebounceThrottle";
import "@/plugins/prototypes/index";
import { createApp } from "vue";
import App from "./App.vue";
import useClickOutside from "./composable/useClickoutside";
import { installVueI18n } from "./composable/useI18n";
import { setupLoading } from "./composable/useLoading";
import { installRouter } from "./router";
import { installPinia } from "./store";
// import useValidationForm from "./composable/useValidationForm";
const app = createApp(App);

setupLoading(app);
installPinia(app);
installRouter(app);
setupDebounceThrottleDirectives(app);
installVueI18n(app);
// app.use(useValidationForm, {
//   textField: defineAsyncComponent(() => import("@/components/input/TextField.vue")),
//   radioGroup: defineAsyncComponent(() => import("@/components/input/RadioGroup.vue")),
//   radio: defineAsyncComponent(() => import("@/components/input/Radio.vue")),
// });
app.use(useClickOutside);
app.mount("#app");
