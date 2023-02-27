export function injectAuthAPI(query: QueryHandlers) {
  return {
    login: (data: any) => query.post("login", data),
  };
}
