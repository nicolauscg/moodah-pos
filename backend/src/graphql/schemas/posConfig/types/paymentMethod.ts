import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const PaymentMethodType = new GraphQLObjectType({
  name: "PaymentMethod",
  fields: () => ({
    id: globalIdField("account.journal"),
    name: {
      type: GraphQLString
    },
    company: {
      type: new GraphQLObjectType({
        name: "PaymentMethod_Company",
        fields: () => ({
          id: globalIdField("res.company", parent => parent[0]),
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
