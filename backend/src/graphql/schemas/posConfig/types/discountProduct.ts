import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const DiscountProductType = new GraphQLObjectType({
  name: "DiscountProductType",
  fields: () => ({
    id: globalIdField("product.product"),
    name: {
      type: GraphQLString
    }
  })
});

export { DiscountProductType };
