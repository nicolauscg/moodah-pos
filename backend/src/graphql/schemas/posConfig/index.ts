import posConfigQueries from "./query";
import posConfigMutations from "./mutation";

const posConfig = {
  query: posConfigQueries.toConfig().fields,
  mutation: posConfigMutations.toConfig().fields
};

export default posConfig;
