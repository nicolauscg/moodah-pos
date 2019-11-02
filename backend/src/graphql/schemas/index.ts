import { GraphQLSchema, GraphQLObjectType } from "graphql";

import auth from "./auth";
import posConfig from "./posConfig";
import posCategory from "./posCategory";

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
    ...posCategory.mutation
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
