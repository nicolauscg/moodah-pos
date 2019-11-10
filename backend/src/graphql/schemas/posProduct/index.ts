import posProductQueries from "./query";
import posProductMutations from "./mutation";

const posProduct = {
  query: posProductQueries.toConfig().fields,
  mutation: posProductMutations.toConfig().fields
};

export default posProduct;
