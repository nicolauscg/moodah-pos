import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: globalIdField("product.template"),
    name: {
      type: GraphQLString
    }
  })
});

export { CategoryType };
