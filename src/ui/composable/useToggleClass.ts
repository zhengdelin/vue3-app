/**
 * Toggles a CSS class on an HTML element based on the value of a reactive boolean.
 *
 * @param {HTMLElement} el - The HTML element to toggle the class on.
 * @param {Ref<boolean>} active - The reactive boolean that determines whether the class should be added or removed.
 * @param {string} className - The name of the CSS class to toggle.
 * @param {boolean} removeWhenUnmounted - Optional. Whether to remove the class when the element is unmounted. Defaults to true.
 */
function useToggleClass(el: HTMLElement, active: Ref<boolean>, className: string, removeWhenUnmounted = true) {
  watchEffect(() => {
    if (active.value) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  });

  if (removeWhenUnmounted) {
    onUnmounted(() => {
      el.classList.remove(className);
    });
  }
}

export default useToggleClass;
