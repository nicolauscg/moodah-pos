import { FilterConfig } from "../utility/types/filter";

const posProductFilter: FilterConfig = {
  posProducts: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ]
};

export default posProductFilter;
