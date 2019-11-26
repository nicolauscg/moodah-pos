import { GraphQLObjectType } from "graphql";
import { globalIdField } from "graphql-relay";

const OpenSessionType = new GraphQLObjectType({
  name: "openSession",
  fields: () => ({
    sessionId: globalIdField("pos.session", parent => parent.sessionId)
  })
});

export { OpenSessionType };
