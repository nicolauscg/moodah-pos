import { PosProducts, CategoriesSelect } from "../../generated-pos-models";
import { toSuggestions, referenceToOdoo } from "./general";
import { renameKeys } from "./pos-general";
import * as R from "ramda";

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

export const transformPosProductForm = (values, imageField) => {
  return R.pipe(
    renameKeys({
      productType: "type",
      canBeSold: "saleOk",
      canBePurchased: "purchaseOk",
      category: "categId",
      internalReference: "defaultCode",
      HSCode: "hsCode",
      salesPrice: "listPrice",
      cost: "standardPrice"
    }),
    R.evolve({
      type: referenceToOdoo,
      categId: referenceToOdoo,
      listPrice: parseFloat,
      standardPrice: parseFloat
    }),
    R.assoc("image", imageField),
    R.reject(R.either(R.isEmpty, R.isNil))
  )(values);
};

export const prepareCategories = (categories: CategoriesSelect.Categories) => {
  return {
    categories: {
      ...categories,
      records: toSuggestions(categories.records)
    }
  };
};
