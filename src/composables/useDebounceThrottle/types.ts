export interface DebounceConfig {
  /**
   * 延遲多久執行
   */
  delay?: number;
  /**
   * 是否立即執行
   */
  immediately?: boolean;
}

export interface DebounceThrottleFun<ThisType, ArgumentType> {
  (this: ThisType, ...args: ArgumentType[]): unknown;
}
