import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const AvailablePriceListType = new GraphQLObjectType({
  name: "AvailablePriceList",
  fields: () => ({
    id: globalIdField("product.pricelist"),
    name: {
      type: GraphQLString
    },
    currency: {
      type: new GraphQLObjectType({
        name: "AvailablePriceList_Currency",
        fields: () => ({
          id: globalIdField("res.currency", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.currencyId
    }
  })
});

export { AvailablePriceListType };
