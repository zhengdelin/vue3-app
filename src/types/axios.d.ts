// import { injectAllApi } from "@/api";
import { Method, AxiosRequestConfig, AxiosInstance, CancelTokenSource } from "axios";

interface ToastConfig {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successText?: string;
  errorText?: string;
}

export {};

declare module "axios" {
  interface AxiosRequestConfig {
    toastConfig?: ToastConfig;
  }
  interface AxiosInterceptorManager<V> {
    use<T = V>(
      onFulfilled?: ((value: V) => T | Promise<T>) | null,
      onRejected?: ((error: any) => any) | null,
      options?: AxiosInterceptorOptions,
    ): number;
  }
}

// type Query = ReturnType<typeof injectAllApi>;

declare global {
  type APIQueryResponse<T, K> = {
    msg: string;
    data: T;
    message?: string;
  } & K;

  interface APIErrorResponseType1 {
    errors: {
      location: string;
      msg: string;
      param: string;
      value: any;
    }[];
  }
  interface APIErrorResponseType2 {
    message: string;
  }
  type APIErrorResponse = APIErrorResponseType1 | APIErrorResponseType2;

  interface QueryHandler {
    <T, K = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<APIQueryResponse<T, K>>;
  }

  interface QueryHandlers extends Record<Extract<Method, "get" | "post" | "delete" | "patch" | "put">, QueryHandler> {
    $axios: AxiosInstance;
  }

  interface CancelableQueryConfig {
    cancelToken: CancelTokenSource["token"];
  }

  interface ProgressQueryConfig {
    onProgress(p: number): void;
  }

  interface CancelableProgressQueryConfig extends CancelableQueryConfig, ProgressQueryConfig {}
}

// //注入vue實例中
// declare module "vue/types/vue" {
//   interface Vue {
//     // $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
// }

// //注入nuxtApp
// declare module "@nuxt/types" {
//   interface NuxtAppOptions {
//     // $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
//   interface Context {
//     // $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
// }

// declare module "@nuxt/vue-app" {
//   interface NuxtAppOptions {
//     // $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
//   interface Context {
//     // $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
// }

// //注入vuex
// declare module "vuex/types/index" {
//   interface Store<S> {
//     $axios: NuxtAxiosInstance;
//     $query: Query;
//   }
// }
