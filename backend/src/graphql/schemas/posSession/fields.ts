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
  ]
};

export default posSessionFields;
