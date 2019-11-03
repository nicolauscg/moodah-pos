// import posProductQueries from "./query";
import posProductMutations from "./mutation";

const posProduct = {
  mutation: posProductMutations.toConfig().fields
};

export default posProduct;
