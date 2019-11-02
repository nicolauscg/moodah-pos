import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const OperationTypesType = new GraphQLObjectType({
  name: "OperationTypesType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  })
});

export { OperationTypesType };
