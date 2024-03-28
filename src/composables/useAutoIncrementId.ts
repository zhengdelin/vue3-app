type Id = number;

export function useAutoIncrementId<T = any>() {
  const autoIncrementId = {
    id: 1,
    get nextId() {
      return ++this.id;
    },
  };
  const items = reactive<({ id: Id } & T)[]>([]);

  function add(item: T) {
    const id = autoIncrementId.nextId;
    items.push(Object.assign({}, item as any, { id }));
    return id;
  }

  function remove(id: Id) {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    items.splice(index, 1);
  }

  return {
    items,
    add,
    remove,
  };
}
