import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { globalIdField } from "graphql-relay";

const PosSessionType = new GraphQLObjectType({
  name: "PosSessionType",
  fields: () => ({
    id: globalIdField("pos.session"),
    name: {
      type: GraphQLString
    },
    startSession: {
      type: GraphQLString,
      resolve: parent => parent.startAt
    },
    journalId: {
      type: new GraphQLObjectType({
        name: "PosSession_JournalIds",
        fields: () => ({
          id: globalIdField("pos.session", parent => parent[0])
        })
      }),
      resolve: parent => parent.journalIds
    },
    userId: {
      type: new GraphQLObjectType({
        name: "PosSession_userId",
        fields: () => ({
          id: globalIdField("pos.session", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.userId
    },
    configurationId: {
      type: new GraphQLObjectType({
        name: "PosSession_configurationId",
        fields: () => ({
          id: globalIdField("pos.session", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.configId
    },
    sequenceNumber: {
      type: GraphQLInt
    }
  })
});

export { PosSessionType };
