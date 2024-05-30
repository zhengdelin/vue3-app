import { ComponentPublicInstance } from "vue";

/**
 * Returns the HTMLElement of a Vue component or the passed HTMLElement,
 * or undefined if the input is not a Vue component or an HTMLElement.
 *
 * @param {ComponentPublicInstance<any> | HTMLElement} obj - The Vue component or HTMLElement to get the element from.
 * @return {HTMLElement | undefined} The HTMLElement of the Vue component or the passed HTMLElement,
 * or undefined if the input is not a Vue component or an HTMLElement.
 */
export function refElement(obj?: ComponentPublicInstance<any> | HTMLElement): HTMLElement | undefined {
  if (obj && "$el" in obj) {
    const el = obj.$el as HTMLElement;
    if (el?.nodeType === Node.TEXT_NODE) {
      return el.nextElementSibling as HTMLElement;
    }
    return el;
  }
  return obj;
}

export function convertToUnit(str: number, unit?: string): string;
export function convertToUnit(str: string | number | null | undefined, unit?: string): string | undefined;
export function convertToUnit(str: string | number | null | undefined, unit = "px"): string | undefined {
  if (str == null || str === "") {
    return undefined;
  } else if (isNaN(Number(str))) {
    return String(str);
  } else if (!isFinite(Number(str))) {
    return undefined;
  }
  return `${str}${unit}`;
}
