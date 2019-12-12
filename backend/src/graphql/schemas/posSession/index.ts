import posSessionMutations from "./mutation";
import posSessionQueries from "./query";

const posSession = {
  query: posSessionQueries.toConfig().fields,
  mutation: posSessionMutations.toConfig().fields
};

export default posSession;
