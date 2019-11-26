import { FilterConfig } from "../utility/types/filter";

const posConfigFilter: FilterConfig = {
  posConfigs: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    },
    {
      domainName: "stock_location_id",
      conventionName: "stockLocationName",
      operator: "ilike"
    }
  ],
  paymentMethods: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ],
  availablePriceLists: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ],
  operationTypes: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ],
  stockLocations: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ],
  discountProducts: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ]
};

export default posConfigFilter;
