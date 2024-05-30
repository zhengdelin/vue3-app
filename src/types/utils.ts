declare global {
  type UploadableFile = File | Blob;
  type Defined<T = any> = Exclude<T, undefined>;
  type Maybe<T> = T | undefined | null | void;
  type Nullable<T = any> = T | null;
  type MaybePromise<T> = T | Promise<T>;
  type MaybeRef<T> = T | Ref<T>;
  type NotNullObject<T> = NonNullable<T> extends object ? NonNullable<T> : never;

  type RecursiveRequired<T> = T extends object ? { [P in keyof T]-?: RecursiveRequired<T[P]> } : T;

  /**
   * 取得所有為 Optional 的 Key
   */
  export type OptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
  }[keyof T];

  /**
   * 挑選出所有為 Optional Key 的屬性
   */
  type Optionals<T> = Pick<T, OptionalKeys<T>>;
}

export {};
