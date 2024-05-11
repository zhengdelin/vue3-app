import { App } from "vue";
import directive from "./directive";
import Loading from "./components/Loading.vue";

export function useLoading(_loadingWhenPageStart = false) {
  const loading = ref(false);
  // if (loadingWhenPageStart) {
  //   const nuxtApp = useNuxtApp();
  //   const cancelPageStart = nuxtApp.hook("page:start", (_) => {
  //     // console.log("onPageStart", { ...params });
  //     loading.value = true;
  //   });
  //   const cancelPageFinish = nuxtApp.hook("page:finish", (_) => {
  //     // console.log("onPageFinish", { ...params });
  //     loading.value = false;
  //   });
  //   onUnmounted(() => {
  //     cancelPageStart();
  //     cancelPageFinish();
  //   });
  // }

  const execute = async <T>(executor: () => Promise<T>) => {
    try {
      return await new Promise<T>((resolve, reject) => {
        loading.value = true;
        try {
          resolve(executor());
        } catch (error) {
          reject(error);
        }
      });
    } finally {
      loading.value = false;
    }
  };
  return {
    loading,
    execute,
  };
}

export function setupLoading(app: App) {
  app.directive("loading", directive);
  app.component("Loading", Loading);
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    Loading: typeof Loading;
  }
}
