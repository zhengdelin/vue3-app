export interface UseModalBasicProps {
  onCancel?: () => any;

  /**
   * 當回傳值為true時，會自動關閉modal
   * @param close
   * @returns
   */
  onConfirm?: (close: () => void) => MaybePromise<Maybe<boolean>>;
}

export type UseModalAutoCloseEvent = "onCancel";

export interface UseModal<PropsT = UseModalBasicProps> {
  modal: any;
  props?: PropsT;
  slots?: any;
  /**
   * @default true
   */
  destroyWhenClose?: boolean;
  /**
   * @default true
   */
  destroyWhenRouteChange?: boolean;

  /**
   * 當destroyWhenClose為false的時候 預設為true
   */
  destroyWhenUnMounted?: boolean;
  /**
   * @default 呼叫對應事件時自動關閉
   * onConfirm:false
   * onCancel:true
   */
  autoClose?: Partial<Record<UseModalAutoCloseEvent, boolean>>;
}

export interface IModal {
  modal: any;
  modelValue: Ref<boolean>;
  props: any;
}
