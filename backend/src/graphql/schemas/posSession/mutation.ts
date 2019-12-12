import { GraphQLObjectType, GraphQLBoolean } from "graphql";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { camelizeKeys, decamelizeKeys } from "humps";

import { OpenSessionInputType } from "./types/openSessionInput";
import { OpenSessionType } from "./types/openSession";
import { CloseSessionInputType } from "./types/closeSessionInput";
import { PosOrderInputType } from "./types/posOrderInput";
import { PosOrderType } from "./types/posOrder";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require("moment");

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
          const completeDate = new Date();
          const formattedDate = moment(completeDate)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss");

          // set default values
          const fieldsValues = args.input;
          fieldsValues.toInvoice = false;
          fieldsValues.data.fiscalPositionId = false;
          fieldsValues.data.partnerId = false;
          fieldsValues.data.creationDate = completeDate;
          fieldsValues.data.statementIds.name = formattedDate;
          fieldsValues.data.name = `Order ${fieldsValues.id}`;
          fieldsValues.data.uid = fieldsValues.id;

          // adapt shape to match odoo
          let index = 0;
          fieldsValues.data.lines.forEach(order => {
            fieldsValues.data.lines[index] = [0, 0, order];
            index += 1;
          });
          // eslint-disable-next-line array-bracket-newline
          fieldsValues.data.statementIds = [
            [0, 0, fieldsValues.data.statementIds]
            // eslint-disable-next-line array-bracket-newline
          ];

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
