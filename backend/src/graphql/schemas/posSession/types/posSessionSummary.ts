import { GraphQLObjectType, GraphQLInt } from "graphql";

const posSessionSummaryType = new GraphQLObjectType({
  name: "posSessionSummaryType",
  fields: () => ({
    totalNetSale: {
      type: GraphQLInt
    },
    transactions: {
      type: GraphQLInt
    },
    averageOrderValue: {
      type: GraphQLInt
    }
  })
});

export { posSessionSummaryType };
