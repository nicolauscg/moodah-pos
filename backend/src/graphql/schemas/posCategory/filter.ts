import { FilterConfig } from "../utility/types/filter";

const posCategoryFilter: FilterConfig = {
  posCategories: [
    {
      domainName: "name",
      conventionName: "name",
      operator: "ilike"
    }
  ]
};

export default posCategoryFilter;
