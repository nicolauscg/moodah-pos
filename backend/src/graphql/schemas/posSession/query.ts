import { GraphQLObjectType, GraphQLInputObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { GlobalIdInput } from "../utility/types/globalIdInput";
import { posSessionType } from "./types/posSession";
import posSessionFields from "./field";

// const posSessionQueries = new GraphQLObjectType(null);
const posSessionQueries = new GraphQLObjectType({
  name: "posSessionQueries",
  fields: () => ({
    resUser: {
      type: posSessionType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosSessionInput",
            fields: () => ({
              id: {
                type: GlobalIdInput
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
            }).createRead({
              ids: [args.input.id],
              modelName: "pos.session",
              fields: posSessionFields.posSession
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              if (result.length === 0) {
                rej(
                  new ApolloError("Application Error", "APPLICATION_ERROR", {
                    errorMessage: result.message
                  })
                );
              } else {
                res(camelizeKeys(result[0]));
              }
            }
          });
        })
    }
  })
});

export default posSessionQueries;
