import { useAutoIncrementId } from "../useAutoIncrementId";
import { UseModalBasicProps, UseModal, IModal } from "./types";

const { add: addModal, remove: removeModal, items: modalContainers } = useAutoIncrementId<IModal>();
const INITIAL_MODAL_ID = -1;
export default class Modal<PropsT = UseModalBasicProps> {
  static AnimationDuration = 300;

  modal;
  props: PropsT = {} as PropsT;
  slots;
  destroyWhenClose;
  autoClose;

  vNode: VNode | null = null;
  _isRendered = false;
  _destroyModalTimer: any | null = null;
  _id: number = INITIAL_MODAL_ID;
  isVisible = ref(false);
  constructor(params: UseModal<PropsT>) {
    const { modal, props, slots, destroyWhenClose = true, autoClose, destroyWhenRouteChange = true } = params;
    this.modal = modal;
    this.autoClose = autoClose || {};
    this.slots = slots;
    this.destroyWhenClose = destroyWhenClose;
    this._setupProps(props);

    // 避免路由切換了而modal仍然存在
    if (getCurrentInstance()) {
      if (destroyWhenRouteChange) {
        const router = useRouter();
        watch(
          computed(() => router.currentRoute.value.path),
          () => {
            // console.log("routeChange", modal);
            this.destroyModalImmediately();
          },
        );
      }

      const destroyWhenUnMounted = params.destroyWhenUnMounted ?? !destroyWhenClose;

      if (destroyWhenUnMounted) {
        //組件關閉自動銷毀彈窗
        onUnmounted(() => {
          this.destroyModal();
        });
      }
    }
  }

  setModalVisible(v: boolean) {
    // console.log(v ? "openModal" : "closeModal");
    this.isVisible.value = v;
    // console.log("setModalVisible", v);
    // console.log("vnode.component :>> ", this.vNode);
    // this.vNode?.component && (this.vNode.component.props.modelValue = v);
    // console.log(v ? "openModal" : "closeModal", this.vnode.component.props.modelValue);
  }

  closeModal() {
    if (!this.isVisible.value) return;
    // console.log("close modal");
    // console.log("this. :>> ", this.modal);
    this.destroyWhenClose ? this.destroyModal() : this.setModalVisible(false);
  }

  showModal(props?: any) {
    this._clearDestroyModalTimer();
    if (this._isRendered) {
      this.setModalVisible(true);
    } else {
      this._setupProps(props);
      this.vNode = this._createVNode();
      this._renderModal();
    }
  }

  destroyModalImmediately() {
    // this.container?.parentNode?.removeChild(this.container);
    // this.container = null;
    // console.log("remove modal", this._id);
    removeModal(this._id);
    this._id = INITIAL_MODAL_ID;
    this._isRendered = false;
  }

  /**
   * destroy after animation
   */
  destroyModal() {
    this.setModalVisible(false);
    this._setDestroyModalTimer();
  }

  _setupProps(_props?: PropsT) {
    const { onCancel: autoCloseOnCancel = true } = this.autoClose;

    const { onConfirm: _onConfirm, onCancel: _onCancel } = (_props || {}) as UseModalBasicProps;
    const onCancel = () => {
      // console.log("onCancel");
      _onCancel?.();
      autoCloseOnCancel && this.closeModal();
    };

    this.props = Object.assign({}, this.props, _props, {
      modelValue: this.isVisible,
      "onUpdate:modelValue": (v: boolean) => {
        if (v) this.setModalVisible(v);
        else {
          this.closeModal();
        }
      },
      onCancel,
    });

    if (typeof _onConfirm === "function") {
      (this.props as UseModalBasicProps).onConfirm = async () => {
        // console.log("onConfirm");

        const closeModal = () => this.closeModal();
        const res = await _onConfirm?.(() => this.closeModal());
        const needToCloseModal = res === true;

        if (needToCloseModal) {
          closeModal();
        }
      };
    }

    // console.log("this.props :>> ", this.props);
  }

  _createVNode() {
    return h(this.modal, null, this.slots);
  }

  _renderModal() {
    this.isVisible.value = true;
    this._id = addModal({
      modal: this.vNode,
      modelValue: this.isVisible,
      props: this.props,
    });
    // console.log('this._id :>> ', this._id);
    this._isRendered = true;
  }

  _setDestroyModalTimer() {
    this._destroyModalTimer = setTimeout(() => {
      this.destroyModalImmediately();
    }, 1000);
  }

  _clearDestroyModalTimer() {
    if (!this._destroyModalTimer) return;
    // 馬上清除上一次的modal及定時器
    clearTimeout(this._destroyModalTimer);
    this.destroyModalImmediately();
    this._destroyModalTimer = null;
  }
}

export { modalContainers };
