import { toSuggestions } from "./general"
import { PosProductsSelect } from "../../generated-pos-models"

// ====================================================
// Transformers
// ====================================================
export const prepareProducts = (posProducts: PosProductsSelect.PosProducts) => {
  return {
    posProducts: {
      ...posProducts,
      records: toSuggestions(posProducts.records),
    }
  }
}