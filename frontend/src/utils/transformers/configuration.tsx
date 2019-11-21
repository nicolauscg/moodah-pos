import { toSuggestions } from "./general"
import { AvailablePriceListsSelect } from "../../generated-pos-models"

// ====================================================
// Constants
// ====================================================
export const ConfigurationColumns = [
  { name: 'posname', title: 'Point of Sale Name' },
  { name: 'stocklocations', title: 'Stock Locations' },
]

// ====================================================
// Transformers
// ====================================================
export const prepareAvailablePricelists = (
  availablePricelists: AvailablePriceListsSelect.AvailablePriceLists
) => {
  return {
    availablePricelists: {
      ...availablePricelists,
      records: toSuggestions(availablePricelists.records),
    }
  }
}

export const prepareDefaultPricelists = (
  availablePricelists: AvailablePriceListsSelect.AvailablePriceLists
) => {
  return {
    defaultPricelists: {
      ...availablePricelists,
      records: toSuggestions(availablePricelists.records),
    }
  }
}
