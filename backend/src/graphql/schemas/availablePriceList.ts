import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const AvailablePriceListType = new GraphQLObjectType({
  name: "AvailablePriceList",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    currency: {
      type: new GraphQLObjectType({
        name: "AvailablePriceList_Currency",
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
      }),
      resolve: parent => parent.currencyId
    }
  })
});

export { AvailablePriceListType };
