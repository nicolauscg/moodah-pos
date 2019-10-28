import { GraphQLBoolean, GraphQLObjectType } from "graphql";
import { PosCategoryType } from "./posCategory";

const UpdateOrDeletePosCategoryType = new GraphQLObjectType({
  name: "UpdateOrDeletePosCategoryType",
  fields: () => ({
    posCategory: {
      type: PosCategoryType
    },
    success: {
      type: GraphQLBoolean
    }
  })
});

export { UpdateOrDeletePosCategoryType };
