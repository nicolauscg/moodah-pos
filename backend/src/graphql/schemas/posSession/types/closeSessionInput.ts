import { GraphQLInputObjectType } from "graphql";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const CloseSessionInputType = new GraphQLInputObjectType({
  name: "closeSessionInput",
  fields: () => ({
    id: {
      type: GlobalIdInput
    }
  })
});

export { CloseSessionInputType };
