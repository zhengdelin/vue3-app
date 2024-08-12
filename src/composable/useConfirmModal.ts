import ConfirmModal from "@/ui/c-confirm-modal/CConfirmModal.vue";
import { useModal } from "./useModal";
import { UseModalBasicProps } from "./useModal/types";

export interface ConfirmModalProps extends UseModalBasicProps {
  cancelText?: string;
  confirmDisabled?: boolean;
  confirmText?: string;
  title?: string;
  text?: string;
  type?: "warning" | "info" | "error";
}

export const $confirm = <T = ConfirmModalProps>(props: T, slots?: any, immediate = true, destroyWhenClose = true) => {
  const confirmModal = useModal({
    modal: ConfirmModal,
    props,
    destroyWhenClose,
    slots,
  });
  if (immediate) {
    confirmModal.show();
  }
  return confirmModal;
};

function create(type: ConfirmModalProps["type"]) {
  return <T = ConfirmModalProps>(props: T, slots?: any, immediate = true, destroyWhenClose = true) =>
    $confirm(
      {
        ...props,
        type,
      },
      slots,
      immediate,
      destroyWhenClose,
    );
}

$confirm.warning = create("warning");
$confirm.info = create("info");
$confirm.error = create("error");
