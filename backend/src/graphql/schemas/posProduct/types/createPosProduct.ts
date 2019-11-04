import { GraphQLInt, GraphQLObjectType } from "graphql";
import { PosProductType } from "./posProduct";

const CreatePosProductType = new GraphQLObjectType({
  name: "CreatePosProductType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    posProduct: {
      type: PosProductType
    }
  })
});

export { CreatePosProductType };
