<script setup lang="tsx">
import { $confirm } from "@/composable/useConfirmModal";
import { useModal } from "@/composable/useModal";
import CModal from "@/ui/c-modal/CModal.vue";

//
const content = () => (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, ratione, maxime recusandae delectus tempora
    accusamus adipisci a voluptate aut cumque quis fugit similique explicabo at voluptates temporibus vel quod beatae.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta blanditiis repellat atque nemo exercitationem neque
    a impedit libero veritatis quisquam natus tempora, dolorum enim corporis incidunt consequuntur ullam nisi sit?Lorem,
    ipsum dolor sit amet consectetur adipisicing elit. Dolores, reiciendis quibusdam quia veniam excepturi quos id
    consequatur eligendi quasi provident nobis aliquid ad error repudiandae dignissimos totam assumenda, dolore
    minima!Loremlore Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat ut nemo dolore molestiae voluptas,
    architecto expedita laudantium. Saepe dolor error quae magni vero, eum dolorum aliquid molestias, soluta, expedita
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe voluptatem iusto illo ipsa laborum reprehenderit eos
    sed. Quisquam repellendus rem nobis voluptates totam aliquid tenetur odit repellat distinctio? Ut, suscipit!
  </div>
);

const basicModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
  },
  slots: {
    default: content,
  },
});

const onConfirmEventModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
    onConfirm(close) {
      $confirm.warning({
        title: "真的要關閉彈窗嗎?",
        text: "真的要關閉彈窗嗎?",
        onConfirm() {
          close();
        },
      });
    },
  },
  slots: {
    default: content,
  },
});

const scrollContentModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
    scrollContent: true,
  },
  slots: {
    default: content,
  },
});

const notCloseOnClickOverlayModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
    onOverlayClick: "none",
  },
  slots: {
    default: content,
  },
});

const formModel = ref({
  name: "123",
});
const modalBindForm = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      minHeight: "400px",
      maxHeight: "90vh",
    },
    formModel: formModel,
  },
  slots: {
    default() {
      return (
        <input
          value={formModel.value.name}
          onInput={(e) => (formModel.value.name = (e.target as HTMLInputElement).value)}
          type="text"
        />
      );
    },
  },
});

const customFooterModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
    scrollContent: true,
  },
  slots: {
    default: content,
    footer: ({ close }: { close: () => void }) => {
      return <c-btn onClick={close}>點我關閉</c-btn>;
    },
  },
});

const confirmBtnLoadingModal = useModal({
  modal: CModal,
  props: {
    title: "Hello I am title.",
    style: {
      maxWidth: "400px",
      maxHeight: "90vh",
    },
    confirmBtnProps: {
      loading: true,
    },
  },
});
</script>
<template>
  <div class="flex gap-2 flex-wrap">
    <c-btn @click="basicModal.show">Show BasicUsage</c-btn>
    <c-btn @click="onConfirmEventModal.show">Show OnConfirmEvent</c-btn>
    <c-btn @click="scrollContentModal.show">Show ScrollContentModal</c-btn>
    <c-btn @click="notCloseOnClickOverlayModal.show">Show Not CloseOnClickOverlayModal</c-btn>
    <c-btn @click="modalBindForm.show">Show modalBindForm</c-btn>
    <c-btn @click="customFooterModal.show">Show CustomFooterModal</c-btn>
    <c-btn @click="confirmBtnLoadingModal.show">Show ConfirmBtnLoadingModal</c-btn>
  </div>
</template>
<style scoped lang="scss"></style>
