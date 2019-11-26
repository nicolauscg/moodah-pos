import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const OperationTypesType = new GraphQLObjectType({
  name: "OperationTypesType",
  fields: () => ({
    id: globalIdField("stock.picking.type"),
    name: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    }
  })
});

export { OperationTypesType };
