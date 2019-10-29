import { GraphQLInputObjectType, GraphQLInt } from "graphql";

const PagableInputType = new GraphQLInputObjectType({
  name: "PagableInputType",
  fields: () => ({
    first: {
      type: GraphQLInt
    },
    offset: {
      type: GraphQLInt
    }
  })
});

export { PagableInputType };
