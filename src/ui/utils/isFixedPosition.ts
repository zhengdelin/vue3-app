export default function isFixedPosition(el?: HTMLElement) {
  if (!el) return false;
  while (el) {
    if (window.getComputedStyle(el).position === "fixed") {
      return true;
    }
    el = el.offsetParent as HTMLElement;
  }
  return false;
}
