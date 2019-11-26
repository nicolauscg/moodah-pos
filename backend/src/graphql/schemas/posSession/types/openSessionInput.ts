import { GraphQLInputObjectType } from "graphql";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const OpenSessionInputType = new GraphQLInputObjectType({
  name: "openSessionInput",
  fields: () => ({
    id: {
      type: GlobalIdInput
    }
  })
});

export { OpenSessionInputType };
