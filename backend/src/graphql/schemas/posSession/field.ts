import { FieldConfig } from "../utility/types/fields";

const posSessionFields: FieldConfig = {
  userInfo: ["name", "company_id", "image", "function"],
  accountBankStatement: [
    "account_id",
    "currency_id",
    "journal_id",
    "pos_session_id",
    "total_entry_encoding"
  ]
};

export default posSessionFields;
