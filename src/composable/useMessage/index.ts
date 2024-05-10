import Message from "./message";
import { UseMessage } from "./types";

const $message: UseMessage = (config) => {
  const message = new Message(config);
  message.show();
  setTimeout(() => {
    message.destroy();
  }, 3000);
};
$message.success = (text) => {
  $message({ type: "success", text });
};
$message.error = (text) => {
  $message({ type: "error", text });
};
$message.warning = (text) => {
  $message({ type: "warning", text });
};
$message.info = (text) => {
  $message({ type: "info", text });
};

export { $message };
