import { GraphQLBoolean, GraphQLObjectType } from "graphql";
import { PosConfigType } from "./posConfig";

const UpdateOrDeletePosConfigType = new GraphQLObjectType({
  name: "UpdateOrDeletePosConfigType",
  fields: () => ({
    posConfig: {
      type: PosConfigType
    },
    success: {
      type: GraphQLBoolean
    }
  })
});

export { UpdateOrDeletePosConfigType };
