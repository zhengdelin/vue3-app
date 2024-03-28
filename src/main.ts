import { createApp } from "vue";
import "@/assets/styles/app.scss";
import App from "./App.vue";
import { installPinia } from "./store";
import { setupDebounceThrottleDirectives } from "@/composables/useDebounceThrottle";
import { installRouter } from "./router";
import "@/plugins/prototypes/index";
import { setupLoading } from "./composables/useLoading";
import { installVueI18n } from "./composables/useI18n";
const app = createApp(App);

setupLoading(app);
installPinia(app);
installRouter(app);
setupDebounceThrottleDirectives(app);
installVueI18n(app);
app.mount("#app");
