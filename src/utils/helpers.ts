/**
 * 將value的值控制在min、max之間
 * @param value
 * @param min
 * @param max
 * @returns
 */
export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}
