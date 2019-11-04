import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  })
});

export { CategoryType };
