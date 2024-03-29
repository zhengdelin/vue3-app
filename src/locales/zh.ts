import { PickupPaths } from "vue-i18n";
// import en from "./en";

const zhMessage = {
  // word
  please: "請",
  pleaseInput: "@:please{'輸入'}",
  pleaseSelect: "@:please{'選擇'}",
  verification: "驗證",
  male: "男性",
  female: "女性",
  open: "開啟",
  close: "關閉",
  enabled: "啟用",
  disabled: "禁用",
  "active.true": "@:enabled",
  "active.false": "停用",
  language: "語言",
  resetPassword: "重設密碼",
  type: "類型",
  status: "狀態",
  ip: "IP",
  hour: "時",
  day: "日",
  domain: "Domain",
  port: "連接埠(Port)",
  host: "伺服器名稱(Host)",
  address: "地址",
  fullAddress: "@:address",
  city: "縣市",
  town: "區域",
  leave: "離開",
  stay: "停留",

  // 通用欄位
  email: "電子郵件",
  account: "帳號 | 帳號(@:email{')'}",
  password: "密碼",
  confirmPassword: "再次確認密碼",
  code: "@:verification{'碼'}",
  nickname: "暱稱",
  id: "編號",
  name: "名稱 | 姓名",
  phone: "手機號碼",
  sex: "性別",
  birthday: "生日",
  active: "狀態",
  created_at: "建立時間",
  country_code: "區碼",
  city_id: "@:city",
  town_id: "@:town",
  updated_at: "最後更新",

  placeholders: {
    account: "@:pleaseInput@:account",
    email: "@:pleaseInput@:email",
    password: "@:pleaseInput@:password",
    nickname: "@:pleaseInput@:nickname",
    confirmPassword: "請@:confirmPassword",
    code: "@:pleaseInput@:code",
    name: "@:pleaseInput@:name",
    phone: "@:pleaseInput@:phone",
    country_code: "@:pleaseSelect@:country_code",
    birthday: "@:pleaseSelect@:birthday",
    city_id: "@:pleaseSelect@:city_id",
    town_id: "@:pleaseSelect@:town_id",
    address: "@:pleaseInput@:address",

    // custom
  },

  // sentences
  sentences: {
    youHaveUnsavedChanges: "您尚有未儲存的變更",
  },
  // symbol
  roundBrackets: "（{text}）",

  // conjunction
  and: "和 | 與 | 及",

  // vuelidate
  validations: {
    theSameAs: "@:{property}與{value}不相同",
    theSameAsPassword: "@:{property}與密碼不相同",
    required: "@:{property}為必填",
    email: "@:{property}格式不符合",
    regex: "@:{property}格式不符合",
    minLength: "@:{property}最少為{min}位",
    maxLength: "@:{property}最多為{max}位",
  },
};

export default zhMessage;
export type MessageSchema = typeof zhMessage;
// export type MessageKeys = PickupPaths<MessageSchema> & PickupPaths<typeof en>;
export type MessageKeys = PickupPaths<MessageSchema>;
