import { GraphQLObjectType, GraphQLBoolean } from "graphql";
import { PosProductType } from "./posProduct";

const UpdateOrDeletePosProductType = new GraphQLObjectType({
  name: "UpdateOrDeletePosProductType",
  fields: () => ({
    posProduct: {
      type: PosProductType
    },
    success: {
      type: GraphQLBoolean
    }
  })
});

export { UpdateOrDeletePosProductType };
