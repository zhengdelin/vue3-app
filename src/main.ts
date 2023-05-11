import { createApp } from "vue";
import "virtual:windi.css";
import "@/assets/styles/app.scss";
import App from "./App.vue";
import { installPinia } from "./store";
import { setupDebounceThrottleDirectives } from "@/composables/useDebounceThrottle";
import { installNotifications } from "@/composables/useNotifications";
import { installRouter } from "./router";
import "@/plugins/extend-prototype/index";
const app = createApp(App);

installPinia(app);
installNotifications(app);
installRouter(app);
setupDebounceThrottleDirectives(app);

app.mount("#app");
