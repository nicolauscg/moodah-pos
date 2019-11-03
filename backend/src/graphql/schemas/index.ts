import { GraphQLSchema, GraphQLObjectType } from "graphql";

import auth from "./auth";
import posConfig from "./posConfig";
import posCategory from "./posCategory";
import posProduct from "./posProduct";

const rootType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...posConfig.query,
    ...posCategory.query
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...auth.mutation,
    ...posConfig.mutation,
    ...posCategory.mutation,
    ...posProduct.mutation
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
