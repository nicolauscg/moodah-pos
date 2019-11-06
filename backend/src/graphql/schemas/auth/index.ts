import authMutations from "./mutation";

const auth = {
  mutation: authMutations.toConfig().fields
};

export default auth;
