import { GraphQLObjectType } from "graphql";
import { PosCategoryType } from "./posCategory";
import { globalIdField } from "graphql-relay";

const CreatePosCategoryType = new GraphQLObjectType({
  name: "CreatePosCategoryType",
  fields: () => ({
    id: globalIdField("pos.category"),
    posCategory: {
      type: PosCategoryType
    }
  })
});

export { CreatePosCategoryType };
