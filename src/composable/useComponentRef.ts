function useComponentRef<T extends abstract new (...args: any) => any>(_: T) {
  return ref<InstanceType<T> | null>();
}

export default useComponentRef;
