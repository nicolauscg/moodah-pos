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
  ]
};

export default posConfigFilter;
