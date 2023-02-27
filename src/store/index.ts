// https://pinia.vuejs.org/ssr/nuxt.html
// npm i pinia
import { createPinia, defineStore } from "pinia";
import { App } from "vue";
export function installPinia(app: App) {
  app.use(createPinia());
}

export const useStore = defineStore("index", () => {
  const count = ref(1);
  return {
    count,
  };
});
