import { FieldConfig } from "../utility/types/fields";

const posSessionFields: FieldConfig = {
  posSession: [
    "id",
    "journal_ids",
    "name",
    "user_id",
    "config_id",
    "start_at",
    "stop_at",
    "sequence_number",
    "login_number"
  ],
  accountBankStatement: [
    "account_id",
    "currency_id",
    "journal_id",
    "state",
    "name",
    "user_id",
    "pos_session_id"
  ]
};

export default posSessionFields;
