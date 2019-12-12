import { toSuggestions, referenceFromOdoo } from "./general";
import { PosCategories, PosCategory } from "../../generated-pos-models";
import * as R from "ramda";

// ====================================================
// Constants
// ====================================================
export const CategoryColumns = [{ name: "displayName", title: "Display Name" }];

// ====================================================
// Transformers
// ====================================================
export const preparePosCategory = (posCategory: PosCategory.PosCategory) => {
  return R.pipe(
    R.evolve({
      parent: referenceFromOdoo
    }),
    R.dissoc("__typename")
  )(posCategory);
};

export const prepareParents = (posCategories: PosCategories.PosCategories) => {
  return {
    posCategories: {
      ...posCategories,
      records: toSuggestions(posCategories.records)
    }
  };
};
