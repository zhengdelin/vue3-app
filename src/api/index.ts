import { getBaseURL } from "@/compositions/useUtils";
import { injectAuthAPI } from "./auth";
import { useAxios } from "./AxiosConfig";
import { injectGlobalAPI } from "./global";
import { injectImageAPI } from "./image";

export function injectAllAPI(queryHandlers: QueryHandlers) {
  return {
    auth: injectAuthAPI(queryHandlers),
    global: injectGlobalAPI(queryHandlers),
    image: injectImageAPI(queryHandlers),
  };
}
export const $api = injectAllAPI(useAxios(getBaseURL()));
