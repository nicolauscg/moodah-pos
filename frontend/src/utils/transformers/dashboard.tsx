import { toSuggestions } from "./general";
import { PosCategories, PosConfigs } from "../../generated-pos-models";

// ====================================================
// Constants
// ====================================================
export const DashboardColumns = [
  { name: "name", title: "Point of Sale Name" },
  { name: "stockLocation", title: "Stock Location" }
];

// ====================================================
// Transformers
// ====================================================
export const preparePosConfigRows = (rows: Array<PosConfigs.Records>) => {
  return rows.map(row => ({
    ...row,
    stockLocation: row.stockLocation.name
  }));
};
