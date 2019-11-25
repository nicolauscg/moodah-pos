import { FieldConfig } from "../utility/types/fields";

const posConfigFields: FieldConfig = {
  posConfig: [
    "id",
    "name",
    "active",
    "iface_tax_included",
    "module_pos_discount",
    "discount_product_id",
    "discount_pc",
    "use_pricelist",
    "available_pricelist_ids",
    "pricelist_id",
    "restrict_price_control",
    "journal_ids",
    "is_header_or_footer",
    "receipt_header",
    "receipt_footer",
    "stock_location_id",
    "picking_type_id",
    "current_session_id",
    "current_session_state"
  ]
};

export default posConfigFields;
