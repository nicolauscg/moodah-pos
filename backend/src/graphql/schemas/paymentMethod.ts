import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const PaymentMethodType = new GraphQLObjectType({
  name: "PaymentMethod",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    company: {
      type: new GraphQLObjectType({
        name: "PaymentMethod_Company",
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
      resolve: parent => parent.companyId
    }
  })
});

export { PaymentMethodType };
