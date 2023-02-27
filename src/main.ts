import { createApp } from "vue";
import "virtual:windi.css";
import "./style.css";
import "./assets/css/app.scss";
import App from "./App.vue";
import { installPinia } from "./store";
import { setupDebounceThrottleDirectives } from "./compositions/useDebounceThrottle";
import { installNotifications } from "./compositions/useNotifications";
import { installRouter } from "./router";

const app = createApp(App);

installPinia(app);
installNotifications(app);
installRouter(app);
setupDebounceThrottleDirectives(app);

app.mount("#app");
