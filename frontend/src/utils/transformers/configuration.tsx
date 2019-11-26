import {
  toSuggestions,
  referenceToOdoo,
  toSuggestion,
  referenceFromOdoo
} from "./general";
import { renameKeys, radioGroupToOdoo } from "./pos-general";
import {
  AvailablePriceListsSelect,
  DiscountProductsSelect,
  StockLocationsSelect,
  PaymentMethodsSelect,
  PosConfig
} from "../../generated-pos-models";
import * as R from "ramda";

// ====================================================
// Constants
// ====================================================
export const ConfigurationColumns = [
  { name: "name", title: "Point of Sale Name" },
  { name: "stockLocation", title: "Stock Locations" }
];

// ====================================================
// Transformers
// ====================================================
export const preparePosConfig = (posConfig: PosConfig.PosConfig) => {
  return R.pipe(
    R.evolve({
      stockLocation: referenceFromOdoo,
      discountProduct: referenceFromOdoo,
      availablePricelists: R.map(toSuggestion),
      pricelist: referenceFromOdoo,
      paymentMethods: R.map(referenceFromOdoo),
      ifaceTaxIncluded: value => [value]
    }),
    R.dissoc("__typename")
  )(posConfig);
};

export const transformPosConfigForm = values => {
  return R.pipe(
    renameKeys({
      discountProduct: "discountProductId",
      availablePricelists: "availablePricelistIds",
      pricelist: "pricelistId",
      paymentMethods: "journalIds",
      stockLocation: "stockLocationId",
      globalDiscount: "modulePosDiscount"
    }),
    R.evolve({
      discountProductId: referenceToOdoo,
      pricelistId: referenceToOdoo,
      stockLocationId: referenceToOdoo,
      availablePricelistIds: R.map(referenceToOdoo),
      journalIds: R.map(referenceToOdoo),
      ifaceTaxIncluded: radioGroupToOdoo,
      discountPc: parseFloat
    }),
    R.reject(R.either(R.isEmpty, R.isNil))
  )(values);
};

export const prepareAvailablePricelists = (
  availablePricelists: AvailablePriceListsSelect.AvailablePriceLists
) => {
  return {
    availablePriceLists: {
      ...availablePricelists,
      records: toSuggestions(availablePricelists.records)
    }
  };
};

export const prepareDiscountProducts = (
  discountProducts: DiscountProductsSelect.DiscountProducts
) => {
  return {
    discountProducts: {
      ...discountProducts,
      records: toSuggestions(discountProducts.records)
    }
  };
};

export const prepareStockLocations = (
  stockLocations: StockLocationsSelect.StockLocations
) => {
  return {
    stockLocations: {
      ...stockLocations,
      records: toSuggestions(stockLocations.records)
    }
  };
};

export const preparePaymentMethods = (
  paymentMethods: PaymentMethodsSelect.PaymentMethods
) => {
  return {
    paymentMethods: {
      ...paymentMethods,
      records: toSuggestions(paymentMethods.records)
    }
  };
};
