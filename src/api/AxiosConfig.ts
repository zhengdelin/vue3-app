import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosProgressEvent } from "axios";

function getToastConfig({ success = {}, error = {} }: AxiosRequestConfig["toastConfig"] = { success: {}, error: {} }) {
  return {
    success,
    error,
  };
}

// 註冊攔截器
export function registerAxiosInterceptors($axios: AxiosInstance) {
  // console.log("app :>> ", app);
  $axios.interceptors.request.use(
    (config) => {
      // 設置Token
      // const cookies = ((req ? req.headers.cookie : document.cookie) || "").split(";");
      // const token = cookies.find(cookie => cookie.includes("token"));
      // if (token) {
      //   // 將 token 加入到請求頭中
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      console.log("interceptorRequestError :>> ", error);
      return Promise.reject(error);
    },
  );
  $axios.interceptors.response.use(
    (response) => {
      const data = response.data as APIQueryResponse;
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
      } else {
        // 預設的提示方式
        if (config.method !== "get" && data.message) {
        }
      }
      return data;
    },
    (error: AxiosError<unknown>) => {
      const errorResponse = error.response;
      const returnData = Promise.reject(errorResponse?.data);
      if (errorResponse) {
        const config = errorResponse.config;
        if (process.env.NODE_ENV !== "production") {
          console.group(`${config.method} ${config.url}`);
          console.error(errorResponse);
          console.groupEnd();
        }
        switch (errorResponse.status) {
          case 401: {
            // 憑證過期重新登入
            break;
          }
          default: {
            const { error } = getToastConfig(config.toastConfig);
            if (!error) return returnData;
            if (error.message) {
              // 自訂錯誤訊息
            } else {
              // 預設錯誤訊息
              const data = errorResponse.data as APIErrorResponse;
            }
          }
        }
      }
      return returnData;
    },
  );
}

export function useAxios(baseURL = "/api") {
  const $axios = axios.create({
    baseURL,
    timeout: 20000,
  });

  // 註冊攔截器
  registerAxiosInterceptors($axios);

  return registerQueryHandlers($axios);
}

export function registerQueryHandlers(axios: AxiosInstance): QueryHandlers {
  return {
    get: (url, data, config) => axios.get(url, { ...config, params: data }),
    post: (url, data, config) => axios.post(url, data, config),
    put: (url, data, config) => axios.put(url, data, config),
    patch: (url, data, config) => axios.patch(url, data, config),
    delete: (url, data, config) => axios.delete(url, { ...config, data }),
    $axios: axios,
  };
}
/**
 * 取得上傳進度
 * @param progressEvent
 * @returns
 */
export const getUploadProgress = (progressEvent: AxiosProgressEvent) => {
  const { loaded, total = 100 } = progressEvent;
  return Math.floor((loaded * 100) / total);
};
/**
 * 取得下載進度
 * @param progressEvent
 * @returns
 */
export const getDownloadProgress = (progressEvent: AxiosProgressEvent) => {
  const { loaded, total = 100 } = progressEvent;
  return Math.floor((loaded * 100) / total);
};

export function getCancelTokenSource() {
  return axios.CancelToken.source();
}
