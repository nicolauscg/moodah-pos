import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const DiscountProductType = new GraphQLObjectType({
  name: "DiscountProductType",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

export { DiscountProductType };
