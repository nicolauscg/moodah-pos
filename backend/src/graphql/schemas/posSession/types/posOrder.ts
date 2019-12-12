import { GraphQLObjectType, GraphQLInt } from "graphql";

const PosOrderType = new GraphQLObjectType({
  name: "PosOrderType",
  fields: () => ({
    result: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    }
  })
});

export { PosOrderType };
