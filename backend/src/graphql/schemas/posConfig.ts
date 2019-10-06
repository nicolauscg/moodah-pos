import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const PosConfigType = new GraphQLObjectType({
  name: "PosConfig",
  fields: () => ({
    id: globalIdField("pos.config"),
    name: {
      type: GraphQLString
    },
    active: {
      type: GraphQLBoolean
    }
  })
});

export { PosConfigType };
