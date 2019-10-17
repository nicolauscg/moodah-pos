import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { resolve } from "path";

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

// eslint-disable-next-line no-warning-comments
/* 
TODO: - liat  di 178, inspect di create pos, inspect xhs --> fungsinya name_search
        - buka repo nodoo, di test liat name_search 
        - liat resolver
        - implememtn resolver
        - bikin test
        - ok nic

*/
