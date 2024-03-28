import { Directive } from "vue";
import { debounce, throttle } from ".";

export const debounceDirective: Directive = {
  beforeMount(el, binding) {
    el.$handle = debounce(binding.value);
    el.addEventListener("click", el.$handle);
  },
  unmounted(el) {
    el.removeEventListener("click", el.$handle);
  },
};

export const throttleDirective: Directive = {
  beforeMount(el, binding) {
    el.$handle = throttle(binding.value);
    el.addEventListener("click", el.$handle);
  },
  unmounted(el) {
    el.removeEventListener("click", el.$handle);
  },
};
