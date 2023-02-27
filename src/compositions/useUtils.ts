/**
 * 檢查物件是否為空
 * @param {any} data
 * @returns
 */
export function isNullOrEmpty(data: any) {
  if (!data) return true;
  const type = Object.prototype.toString.call(data);
  switch (type) {
    case "[object Array]":
      return data.length === 0;
    case "[object Object]":
      return Object.keys(data).length === 0;
    case "[object Map]":
      return data.size === 0;
    default:
      return !data;
  }
}

export function getBaseURL() {
  return import.meta.env.VITE_URL;
}
