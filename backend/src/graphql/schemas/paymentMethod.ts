import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const PaymentMethodType = new GraphQLObjectType({
  name: "PaymentMethodType",
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

export { PaymentMethodType };
