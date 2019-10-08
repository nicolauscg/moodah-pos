import { GraphQLString, GraphQLInputObjectType } from "graphql";

const SignInInputType = new GraphQLInputObjectType({
  name: "SignInInput",
  fields: () => ({
    db: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    }
  })
});

export { SignInInputType };
