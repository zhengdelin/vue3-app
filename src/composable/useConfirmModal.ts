import { useModal } from "./useModal";
import { UseModalBasicProps } from "./useModal/types";
import ConfirmModal from "@/ui/c-confirm-modal/index.vue";

export interface ConfirmModalProps extends UseModalBasicProps {
  cancelText?: string;
  confirmDisabled?: boolean;
  confirmText?: string;
  title?: string;
  text?: string;
  type?: "warning";
}

export const $confirm = <T = ConfirmModalProps>(props: T, immediate = true, destroyWhenClose = true) => {
  const confirmModal = useModal({
    modal: ConfirmModal,
    props,
    destroyWhenClose,
  });
  if (immediate) {
    confirmModal.show();
  }
  return confirmModal;
};
$confirm.warning = <T = ConfirmModalProps>(props: T, immediate = true, destroyWhenClose = true) =>
  $confirm(
    {
      ...props,
      type: "warning",
    },
    immediate,
    destroyWhenClose,
  );
