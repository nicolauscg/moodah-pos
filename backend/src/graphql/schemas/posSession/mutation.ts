import { GraphQLObjectType, GraphQLBoolean } from "graphql";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { camelizeKeys, decamelizeKeys } from "humps";

import { OpenSessionInputType } from "./types/openSessionInput";
import { OpenSessionType } from "./types/openSession";
import { CloseSessionInputType } from "./types/closeSessionInput";
import { PosOrderInputType } from "./types/posOrderInput";
import { PosOrderType } from "./types/posOrder";

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
        new Promise((promiseResolve, promiseReject) => {
          configureService({
            operation: getDataSet({ context }).createCallMethod({
              modelName: "pos.config",
              methodName: "open_session_cb",
              args: [args.input.id]
            }),
            onError: error =>
              promiseReject(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              ),
            onResult: () => promiseResolve()
          });
        }).then(
          () =>
            new Promise((promiseResolve2, promiseReject2) => {
              configureService({
                operation: getDataSet({ context }).createCallMethod({
                  modelName: "pos.config",
                  methodName: "open_session_cb",
                  args: [args.input.id]
                }),
                onError: error =>
                  promiseReject2(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: error.message
                    })
                  ),
                onResult: result =>
                  promiseResolve2({
                    sessionId: (camelizeKeys(result) as any).resId
                  })
              });
            })
        )
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
    },
    posOrder: {
      type: PosOrderType,
      args: {
        input: {
          type: PosOrderInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          // adapt shape to match odoo
          const fieldsValues = args.input;
          const fieldData = fieldsValues.data;
          let index = 0;
          fieldData.lines.forEach(order => {
            fieldData.lines[index].taxIds = [[6, false, []]];
            fieldData.lines[index].packLotIds = [];
            fieldData.lines[index] = [0, 0, order];
            index += 1;
          });
          fieldData.statementIds = [[0, 0, fieldData.statementIds]];

          configureService({
            operation: getDataSet({ context }).createCallMethod({
              modelName: "pos.order",
              methodName: "create_from_ui",
              args: [[decamelizeKeys(fieldsValues)]]
            }),
            onError: error =>
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              ),
            onResult: result => res(result)
          });
        })
    }
  })
});

export default posSessionMutations;
