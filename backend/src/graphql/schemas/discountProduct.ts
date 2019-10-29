import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const DiscountProductType = new GraphQLObjectType({
  name: "DiscountProductType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  })
});

export { DiscountProductType };
