export function toKebabCase(str = "") {
  if (toKebabCase.cache.has(str)) return toKebabCase.cache.get(str);
  // console.log("str :>> ", str);
  // let kebab = str.replace(/[^a-z]/gi, "-");
  // console.log("kebab :>> ", kebab);
  // kebab = kebab.replace(/\B([A-Z])/g, "-$1");
  // console.log("kebab :>> ", kebab);
  // kebab = kebab.toLowerCase();
  // console.log("kebab :>> ", kebab);
  // toKebabCase.cache.set(str, kebab);
  const kebab = str
    .replace(/[^a-z]/gi, "-") // 將所有非英文字母轉為-
    .replace(/\B([A-Z])/g, "-$1") // 將所有大寫字母轉為"-字母"，排除掉單詞邊界(例如：ModelValue -> Model-value)
    .toLowerCase();
  toKebabCase.cache.set(str, kebab);
  return kebab;
}
toKebabCase.cache = new Map();

/**
 * data.email -> ["data", "email"]
 */
export function toStringPath(str: string) {
  return str.split(".");
}
/**
 * 首字大寫
 */
export function toCapitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 全轉小寫後首字大寫
 */
export function toLowerThenCapitalize(str: string) {
  return toCapitalize(str.toLowerCase());
}
