import { toSuggestions } from "./general"
import { PosCategories } from "../../generated-pos-models"

// ====================================================
// Constants
// ====================================================
export const ProductCategoryColumns = [
  { name: 'displayName', title: 'Display Name' },
]

// ====================================================
// Transformers
// ====================================================
export const prepareParents = (posCategories: PosCategories.PosCategories) => {
  return {
    posCategories: {
      ...posCategories,
      records: toSuggestions(posCategories.records),
    }
  }
}