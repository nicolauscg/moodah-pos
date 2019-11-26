import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const StockLocationType = new GraphQLObjectType({
  name: "StockLocationType",
  fields: () => ({
    id: globalIdField("stock.location"),
    name: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    }
  })
});

export { StockLocationType };
