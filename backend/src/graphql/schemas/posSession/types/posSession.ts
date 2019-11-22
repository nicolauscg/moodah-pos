import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: {
      type: GlobalIdInput,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});
const posSessionType = new GraphQLObjectType({
  name: "posSessionType",
  fields: () => ({
    id: globalIdField("pos.session"),
    name: {
      type: GraphQLString
    },
    company: {
      type: CompanyType,
      resolve: parent => parent.CompanyType
    }
  })
});

export { posSessionType };
