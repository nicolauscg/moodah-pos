import { GraphQLObjectType, GraphQLBoolean } from "graphql";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { camelizeKeys } from "humps";

import { OpenSessionInputType } from "./types/openSessionInput";
import { OpenSessionType } from "./types/openSession";
import { CloseSessionInputType } from "./types/closeSessionInput";

const posSessionMutations = new GraphQLObjectType({
  name: "posSessionMutations",
  fields: () => ({
    openSession: {
      type: OpenSessionType,
      args: {
        input: {
          type: OpenSessionInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({ context }).createCallMethod({
              modelName: "pos.config",
              methodName: "open_session_cb",
              args: [args.input.id]
            }),
            onError: error =>
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              ),
            onResult: result =>
              res({ sessionId: (camelizeKeys(result) as any).resId })
          });
        })
    },
    closeSession: {
      type: new GraphQLObjectType({
        name: "closeSession",
        fields: () => ({
          success: {
            type: GraphQLBoolean
          }
        })
      }),
      args: {
        input: {
          type: CloseSessionInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({ context }).createCallMethod({
              modelName: "pos.session",
              methodName: "action_pos_session_closing_control",
              args: [args.input.id]
            }),
            onError: error =>
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              ),
            onResult: () => res({ success: true })
          });
        })
    }
  })
});

export default posSessionMutations;
