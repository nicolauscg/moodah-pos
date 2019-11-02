import posCategoryQueries from "./query";
import posCategoryMutations from "./mutation";

const posCategory = {
  query: posCategoryQueries.toConfig().fields,
  mutation: posCategoryMutations.toConfig().fields
};

export default posCategory;
