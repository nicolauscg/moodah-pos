import { GraphQLInt, GraphQLObjectType } from "graphql";
import { PosCategoryType } from "./posCategory";

const CreatePosCategoryType = new GraphQLObjectType({
  name: "CreatePosCategoryType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    posCategory: {
      type: PosCategoryType
    }
  })
});

export { CreatePosCategoryType };
