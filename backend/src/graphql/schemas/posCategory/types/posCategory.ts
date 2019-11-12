import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { globalIdField } from "graphql-relay";
import { configureService, getDataSet } from "../../utility/nodoo";
import { ApolloError } from "apollo-server-core";
import { camelizeKeys } from "humps";

const PosCategoryParentType = new GraphQLObjectType({
  name: "PosCategoryParent",
  fields: () => ({
    id: globalIdField("pos.category", parent => parent[0]),
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    },
    displayName: {
      type: GraphQLString,
      resolve: (parent, _0, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createRead({
              modelName: "pos.category",
              ids: [parent[0]],
              fields: ["display_name"]
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result =>
              res((camelizeKeys(result[0]) as any).displayName)
          });
        })
    }
  })
});

const PosCategoryType = new GraphQLObjectType({
  name: "PosCategory",
  fields: () => ({
    id: globalIdField("pos.category"),
    name: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString,
      resolve: parent => (parent.image === false ? null : parent.image)
    },
    parent: {
      type: PosCategoryParentType,
      resolve: parent => (parent.parentId === false ? null : parent.parentId)
    },
    sequence: {
      type: GraphQLInt
    }
  })
});

export { PosCategoryType };
