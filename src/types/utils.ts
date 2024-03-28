declare global {
  type UploadableFile = File | Blob;
  type Defined<T = any> = Exclude<T, undefined>;
  type Maybe<T> = T | undefined | null | void;
  type Nullable<T = any> = T | null;
  type MaybePromise<T> = T | Promise<T>;
  type MaybeRef<T> = T | Ref<T>;
  type NotNullObject<T> = NonNullable<T> extends object ? NonNullable<T> : never;
}

export {};
