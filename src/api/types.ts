import { AxiosError, AxiosRequestConfig } from "axios";

export {};

interface ToastConfig {
  /**
   * 設置 Toast Success
   * 如果為false，強制不顯示
   * 否則如果有message，則顯示message
   * 否則執行onResponseSuccessShowToast
   */
  success?:
    | {
        message?: string;
      }
    | false;

  /**
   * 設置 Toast Error
   * 如果為false，強制不顯示
   * 否則如果有message，則顯示message
   * 否則執行onResponseErrorShowToast
   */
  error?:
    | {
        message?: string;
      }
    | false;
}

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * 設置 Toast
     *
     */
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

export interface AxiosInterceptorsConfig {
  /**
   * @example
   * const store = useStore();
      // 設置Token
      if (store.token) {
        // 將 token 加入到請求頭中
        config.headers.Authorization = `Bearer ${store.token}`;
      }
   * @param config 
   * @returns 
   */
  onRequestSuccess?: (config: AxiosRequestConfig) => void;
  onRequestError?: (error: any) => void;

  /**
   * @example 
   * 
   * if (errorResponse.status === 401) {
         // 憑證過期重新登入
          const store = useStore();
          const router = useCurRouter();
          nextTick(store.removeUser);
          router.push({
            name: "login",
          });
        } else if (errorResponse.status === 403) {
          //
        }
   * @param payload 
   * @returns 
   */
  onResponseError?: (payload: { error: AxiosError; response: ApiErrorResponse }) => void;

  /**
   * @example 
   * if (config.method !== "get" && data.notify) {
          $message.success(data.message);
        }
   * @param payload 
   * @returns 
   */
  onResponseSuccessShowToast?: (payload: { data: ApiResponse; config: AxiosRequestConfig }) => void;

  /**
   * @example
   * if(error.notify){
   *   $message.error(error.message);
   * }
   * @param payload
   * @returns
   */
  onResponseErrorShowToast?: (payload: { error: ApiErrorResponse; config: AxiosRequestConfig }) => void;
}

declare global {
  export type ApiResponse<T = unknown, K = unknown> = {
    data: T;
    message: string;
    notify: boolean;
    success: boolean;
  } & K;

  export type ApiErrorResponse = Omit<ApiResponse, "data">;
}

// export interface QueryHandler {
//   <T = unknown, K = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T, K>>;
// }

// export interface QueryHandlers extends Record<Extract<Method, "get" | "post" | "delete" | "patch" | "put">, QueryHandler> {
//   $axios: AxiosInstance;
// }

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
