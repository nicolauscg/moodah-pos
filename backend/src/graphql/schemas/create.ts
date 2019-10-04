import { GraphQLObjectType, GraphQLString } from "graphql";

const CreateType = new GraphQLObjectType({
  name: "CreateType",
  fields: () => ({
    username: {
      type: GraphQLString
    },
    parentname: {
      type: GraphQLString
    },
    sequence: {
      type: GraphQLString
    }
  })
})

export { CreateType };
