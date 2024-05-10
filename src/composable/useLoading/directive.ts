import { Directive, render } from "vue";
import Loading from "./components/Loading.vue";

function getLoading(el: HTMLElement) {
  return el.querySelector("div[data-role=loading]");
}

function createLoading(background?: string) {
  const div = document.createElement("div");
  div.dataset.role = "loading";
  render(h(Loading, { background }), div);
  return div;
}

export default ((el, binding) => {
  const curLoading = getLoading(el);

  const bgColor = el.dataset.loadingBg;
  const isShow = binding.value ?? true;
  if (isShow) {
    if (curLoading) return;
    el.appendChild(createLoading(bgColor));
  } else if (curLoading) curLoading.remove();
}) as Directive;
