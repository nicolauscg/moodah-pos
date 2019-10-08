import * as R from 'ramda'

import {
  ResPartners,
  PartnerFormQuery,
  ResPartner,
  PartnerFormFields,
  GetDefaultPartner,
  ResCountries,
  ResCountryStates,
  ResPartnerContacts,
} from '../../generated-models'
import {
  toSuggestions,
  toSuggestion,
  renameKeys,
  referenceFromOdoo,
  referenceToOdoo,
  getValueOdooSelection,
  textFromOdoo,
} from './general'

// ====================================================
// Constants
// ====================================================
export const ConfigurationColumns = [
  { name: 'posname', title: 'Point of Sale Name' },
  { name: 'stocklocations', title: 'Stock Locations' },

  // { name: 'status', title: 'Status' },
]