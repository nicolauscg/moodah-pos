import { GraphQLBoolean, GraphQLObjectType } from "graphql";
import { PosConfigType } from "./posConfig";

const DeletePosConfigType = new GraphQLObjectType({
  name: "DeletePosConfigType",
  fields: () => ({
    posConfig: {
      type: PosConfigType
    },
    success: {
      type: GraphQLBoolean
    }
  })
});

export { DeletePosConfigType };
