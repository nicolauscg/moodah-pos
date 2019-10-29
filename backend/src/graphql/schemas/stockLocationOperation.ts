import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const StockLocationOperationType = new GraphQLObjectType({
  name: "StockLocationOperationType",
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

export { StockLocationOperationType };
