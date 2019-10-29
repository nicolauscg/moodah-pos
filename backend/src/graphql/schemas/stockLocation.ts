import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const StockLocationType = new GraphQLObjectType({
  name: "StockLocationType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  })
});

export { StockLocationType };
