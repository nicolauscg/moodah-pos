import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { camelizeKeys } from "humps";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { PosSessionType } from "./types/posSession";
import posSessionFields from "./fields";

const posSessionQueries = new GraphQLObjectType({
  name: "posSessionQueries",
  fields: () => ({
    posSession: {
      type: PosSessionType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosSessionInput",
            fields: () => ({
              id: {
                type: GraphQLInt
              }
            })
          })
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead({
              modelName: "pos.session",
              fields: posSessionFields.posSession,
              domain: [
                ["state", "=", "opened"],
                ["user_id", "=", args.input.id]
              ]
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              res(camelizeKeys(result.records[0]));
            }
          });
        })
    }
  })
});

export default posSessionQueries;
