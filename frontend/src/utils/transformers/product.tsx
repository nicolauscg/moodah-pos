import { PosProducts } from "../../generated-pos-models";

// ====================================================
// Constants
// ====================================================
export const ProductColumns = [
  { name: "internalReference", title: "Internal Reference" },
  { name: "name", title: "Name" },
  { name: "salesPrice", title: "Sales Price" },
  { name: "cost", title: "Cost" },
  { name: "internalCategory", title: "Internal Category" },
  { name: "productType", title: "Product Type" }
];

// ====================================================
// Transformers
// ====================================================
export const prepareProductRows = (rows: Array<PosProducts.Records>) => {
  return rows.map(row => ({
    ...row,
    internalCategory: row.category !== null ? row.category.name : row.category
  }));
};
