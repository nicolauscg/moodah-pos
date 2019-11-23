import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const UserCompanyType = new GraphQLObjectType({
  name: "User_Company",
  fields: () => ({
    id: globalIdField("res.company", parent => parent[0]),
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: globalIdField("res.users"),
    name: {
      type: GraphQLString
    },
    company: {
      type: UserCompanyType,
      resolve: parent => parent.companyId
    },
    image: {
      type: GraphQLString,
      resolve: parent => parent.image || null
    },
    function: {
      type: GraphQLString,
      resolve: parent => parent.function || null
    }
  })
});

export { UserType };
