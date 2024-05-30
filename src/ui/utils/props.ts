type NativeType = null | number | string | boolean | symbol | (() => any);
type InferDefault<P, T> = ((props: P) => T & Record<string, never>) | (T extends NativeType ? T : never);
type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
};

export function makePropsDefault<T>(props: InferDefaults<T>) {
  return props;
}
