import { GraphQLObjectType, GraphQLInt } from "graphql";
import { PosConfigType } from "./posConfig";

const CreatePosConfigType = new GraphQLObjectType({
  name: "CreateType",
  fields: () => ({
    posConfig: {
      type: PosConfigType
    },
    id: {
      type: GraphQLInt
    }
  })
});

export { CreatePosConfigType };
