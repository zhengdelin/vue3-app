import { useAutoIncrementId } from "../useAutoIncrementId";
import { UseMessageConfig } from "./types";

const { add, remove, items: messages } = useAutoIncrementId<UseMessageConfig>();

/**
 * TODO 擴充：點擊訊息本身刪除
 */
export default class Message {
  config: UseMessageConfig;
  _id = -1;
  constructor(config: UseMessageConfig) {
    this.config = config;
  }

  show() {
    this._id = add(this.config);
  }

  destroy() {
    remove(this._id);
  }
}

export { messages };
