import { $message } from "@/composable/useMessage";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, CanceledError } from "axios";
import { AxiosInterceptorsConfig } from "./types";

function getToastConfig({ success = {}, error = {} }: AxiosRequestConfig["toastConfig"] = { success: {}, error: {} }) {
  return {
    success,
    error,
  };
}

// 註冊攔截器
export function registerAxiosInterceptors(
  $axios: AxiosInstance,
  {
    onRequestSuccess,
    onRequestError,
    onResponseSuccessShowToast,
    onResponseErrorShowToast,
    onResponseError,
  }: AxiosInterceptorsConfig = {},
) {
  // console.log("app :>> ", app);
  $axios.interceptors.request.use(
    (config) => {
      onRequestSuccess?.(config);
      return config;
    },
    (error) => {
      onRequestError?.(error);
      console.log("interceptorRequestError :>> ", error);
      return Promise.reject(error);
    },
  );
  $axios.interceptors.response.use(
    (response) => {
      const data: ApiResponse = response.data;
      const config = response.config as AxiosRequestConfig;
      if (process.env.NODE_ENV !== "production") {
        console.group(`${config.method} ${config.url}`);
        console.log(response);
        console.groupEnd();
      }
      const toastConfig = getToastConfig(config.toastConfig);

      const showToast = toastConfig.success;
      // 不顯示toast
      if (!showToast) return data;
      if (showToast.message) {
        // 自訂成功訊息
        $message.success(showToast.message);
      } else {
        // 預設的提示方式
        onResponseSuccessShowToast?.({ data, config });
      }
      return data;
    },
    (error: AxiosError<unknown>) => {
      const errorResponse = error.response;
      const errorResponseData = (errorResponse?.data || {}) as ApiErrorResponse;
      if (errorResponse) {
        const config = errorResponse.config;
        if (process.env.NODE_ENV !== "production") {
          console.group(`${config.method} ${config.url}`);
          console.error(error);
          console.error(errorResponse);
          console.groupEnd();
        }

        onResponseError?.({ error, response: errorResponseData });

        const { error: errorToastConfig } = getToastConfig(config.toastConfig);
        if (!errorToastConfig) return errorResponseData;
        if (errorToastConfig.message) {
          // 自訂錯誤訊息
          $message.error(errorToastConfig.message);
        } else {
          // 預設錯誤訊息
          onResponseErrorShowToast?.({ error: errorResponseData, config });
        }
        throw errorResponseData;
      } else {
        console.log("error :>> ", error);
        //取消
        if (error instanceof CanceledError) {
          return;
        }

        const { code } = error;
        if (code === "ECONNABORTED") {
          //超時
          $message.error("系統連線超時，請稍後再試");
        } else {
          //不知名錯誤
          $message.error("伺服器忙碌中，請稍後在試");
        }

        throw error;
      }
    },
  );
}

export function useAxios(baseURL = "/api", interceptorsConfig?: AxiosInterceptorsConfig) {
  const $axios = axios.create({
    baseURL,
    timeout: 20000,
  });

  // 註冊攔截器
  registerAxiosInterceptors($axios, interceptorsConfig);

  return $axios;
}

// export function registerQueryHandlers(axios: AxiosInstance): QueryHandlers {
//   return {
//     get: (url, data, config) => axios.get(url, { ...config, params: data }),
//     post: (url, data, config) => axios.post(url, data, config),
//     put: (url, data, config) => axios.put(url, data, config),
//     patch: (url, data, config) => axios.patch(url, data, config),
//     delete: (url, data, config) => axios.delete(url, { ...config, data }),
//     $axios: axios,
//   };
// }
// /**
//  * 取得上傳進度
//  * @param progressEvent
//  * @returns
//  */
// export const getUploadProgress = (progressEvent: AxiosProgressEvent) => {
//   const { loaded, total = 100 } = progressEvent;
//   return Math.floor((loaded * 100) / total);
// };
// /**
//  * 取得下載進度
//  * @param progressEvent
//  * @returns
//  */
// export const getDownloadProgress = (progressEvent: AxiosProgressEvent) => {
//   const { loaded, total = 100 } = progressEvent;
//   return Math.floor((loaded * 100) / total);
// };

// export function getCancelTokenSource() {
//   return axios.CancelToken.source();
// }
