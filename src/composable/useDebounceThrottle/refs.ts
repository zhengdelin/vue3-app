import { customRef } from "vue";
import { DebounceConfig } from "./types";
import { debounce } from ".";

export const debounceRef = <T>(val: T, config?: DebounceConfig) =>
  customRef<T>((track, trigger) => ({
    get() {
      track();
      return val;
    },
    set: debounce((newVal) => {
      val = newVal;
      trigger();
    }, config),
  }));
