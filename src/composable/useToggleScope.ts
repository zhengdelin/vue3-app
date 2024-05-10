import { effectScope, watch, onScopeDispose } from "vue";
import type { WatchSource, EffectScope } from "vue";

/**
 * 管理觀察源的生命周期，通過啟動和處置effect scope來實現。
 * 當watch source為true時，則啟動新的effect scope並運行處理函數
 * 否則，停止並釋放當前的effect scope
 * @param {WatchSource<boolean>} source 要觀察的源
 * @param {(reset: () => void) => void} handler 當watch source為true時 要運行的處理函數
 * @returns {void}
 */
function useToggleScope(source: WatchSource<boolean>, handler: (reset: () => void) => void) {
  let scope: EffectScope | null = null;

  /**
   * 停止並釋放當前的效果範圍。
   */
  function dispose() {
    scope?.stop();
    scope = null;
  }

  /**
   * 啟動新的效果範圍並運行處理函數。
   */
  function start() {
    scope = effectScope();
    scope.run(() =>
      handler(() => {
        scope?.stop();
        start();
      }),
    );
  }

  // 監聽 source 的變化
  watch(
    source,
    (isActive) => {
      // 如果 isActive 為 true 且 scope 不存在，則啟動新的效果範圍
      if (isActive && !scope) {
        start();
      }
      // 如果 isActive 為 false，則停止效果範圍
      else if (!isActive) {
        dispose();
      }
    },
    {
      immediate: true,
    },
  );

  // 當效果範圍被銷毀時，也停止範圍以釋放資源
  onScopeDispose(dispose);
}

export default useToggleScope;
