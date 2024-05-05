import { App } from "vue";
import { DebounceConfig, DebounceThrottleFun } from "./types";
import { debounceDirective, throttleDirective } from "./directives";

/**
 * 防抖
 * @param fn
 * @param config
 * @returns
 */
export function debounce<ThisType, ArgumentType>(
  fn: DebounceThrottleFun<ThisType, ArgumentType>,
  config: DebounceConfig = { delay: 1000, immediately: true },
) {
  const { delay = 1000, immediately = true } = config;
  let timer: number | null = null;
  // 點擊第一次執行
  if (immediately) {
    return function (this: ThisType, ...args: ArgumentType[]) {
      // 如果有timer表示不是第一次執行
      const firstClick = !timer;

      if (timer) clearTimeout(timer);

      if (firstClick) fn.apply(this, args); // 綁定實際使用的函數的this及arguments

      timer = window.setTimeout(() => {
        // console.log("timer setTimeout", timer);
        timer = null;
      }, delay);
    };
  }
  // 最後一次執行
  return function (this: ThisType, ...args: ArgumentType[]) {
    if (timer) clearTimeout(timer);

    // 刷新timer
    // 如果delay時間內再次點擊，則會再次刷新timer，而不會執行fn
    timer = window.setTimeout(() => {
      // 綁定實際使用的函數的this及arguments
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 節流
 * @param  fn
 * @param  delay
 * @returns
 */
export function throttle<ThisType, ArgumentType>(fn: DebounceThrottleFun<ThisType, ArgumentType>, delay = 500) {
  let begin = 0;
  return function (this: ThisType, ...args: ArgumentType[]) {
    const curTime = Date.now();
    if (curTime - begin > delay) {
      // 綁定實際使用的函數的this及arguments
      fn.apply(this, args);
      begin = curTime;
    }
  };
}

export function setupDebounceThrottleDirectives(app: App) {
  app.directive("debounce", debounceDirective).directive("throttle", throttleDirective);
}

export * from "./directives";
export * from "./refs";
