import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const rootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    name: {type: GraphQLString, resolve: () => "test"}
  })
})

export const schema = new GraphQLSchema({
  query: rootType
});
