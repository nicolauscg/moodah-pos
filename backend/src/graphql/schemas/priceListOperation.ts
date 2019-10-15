import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const PriceListOperationType = new GraphQLObjectType({
  name: "PriceListOperationType",
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

export { PriceListOperationType };
