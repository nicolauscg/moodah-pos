import { GraphQLSchema, GraphQLObjectType } from "graphql";

import auth from "./auth";
import posConfig from "./posConfig";
import posCategory from "./posCategory";
import posProduct from "./posProduct";
import posSession from "./posSession";

const rootType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...posConfig.query,
    ...posCategory.query,
    ...posProduct.query,
    ...posSession.query
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...auth.mutation,
    ...posConfig.mutation,
    ...posCategory.mutation,
    ...posProduct.mutation,
    ...posSession.mutation
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
