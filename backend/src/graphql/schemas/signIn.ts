import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";

const SignInType = new GraphQLObjectType({
  name: "SignInType",
  fields: () => ({
    username: {
      type: GraphQLString
    },
    isSuperuser: {
      type: GraphQLBoolean
    },
    sessionToken: {
      type: GraphQLString
    }
  })
})

export { SignInType };
