import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { GlobalIdInput } from "../utility/types/globalIdInput";
import { UserType } from "./types/user";
import { PosSessionType } from "./types/posSession";
import posSessionFields from "./field";
import { isFilterArgsValid } from "../utility/filterAndPaginate";
import { PaginateType } from "../utility/types/paginateType";
import { paginateOperationParam } from "../utility/paginate";
import { accountBankStatementType } from "./types/accountBankStatement";
import { posSessionSummaryType } from "./types/posSessionSummary";

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
    },
    getUserInfo: {
      type: UserType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "GetUserInfoInput",
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
            }).createRead({
              ids: [args.input.id],
              modelName: "res.users",
              fields: posSessionFields.userInfo
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
    },
    accountBankStatement: {
      type: PaginateType(accountBankStatementType),
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "accountBankStatementInput",
            fields: () => ({
              id: {
                type: GlobalIdInput
              }
            })
          }),
          defaultValue: {
            first: 10,
            offset: 0
          }
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          if (!isFilterArgsValid(args)) {
            rej(
              new ApolloError("Application Error", "APPLICATION_ERROR", {
                errorMessage:
                  "invalid filter-related input, ensure each field object " +
                  "has only 1 key and OR and AND are mutually exclusive"
              })
            );
          }
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "account.bank.statement",
                  fields: posSessionFields.accountBankStatement,
                  domain: [
                    ["state", "=", "open"],
                    ["pos_session_id", "=", args.input.id]
                  ]
                },
                args
              )
            ),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => res(camelizeKeys(result))
          });
        })
    },
    posSessionSummary: {
      type: posSessionSummaryType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "posSessionSummaryInput",
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
            }).createSearchRead({
              modelName: "account.bank.statement",
              fields: posSessionFields.accountBankStatement,
              domain: [
                ["state", "=", "open"],
                ["pos_session_id", "=", args.input.id]
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
              const resultFields = result.records;

              let totalSale = 0;
              resultFields.forEach(records => {
                totalSale += records.total_entry_encoding;
              });

              res({ totalNetSale: totalSale });
            }
          });
        }).then((saleResult: any) =>
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
                  saleResult.sessionName = result[0].name;
                  res(saleResult);
                }
              }
            });
          }).then(
            (summaryResult: any) =>
              new Promise((res, rej) => {
                configureService({
                  operation: getDataSet({
                    context
                  }).createSearchRead({
                    modelName: "pos.order",
                    fields: posSessionFields.posSession,
                    domain: [["session_id", "=", summaryResult.sessionName]]
                  }),
                  onError: error => {
                    rej(
                      new ApolloError(
                        "Application Error",
                        "APPLICATION_ERROR",
                        {
                          errorMessage: error.message
                        }
                      )
                    );
                  },
                  onResult: result => {
                    summaryResult.transactions = result.length;
                    const averageResult =
                      summaryResult.transactions !== 0
                        ? summaryResult.totalNetSale /
                          summaryResult.transactions
                        : 0;
                    summaryResult.averageOrderValue = averageResult;

                    res(summaryResult);
                  }
                });
              })
          )
        )
    }
  })
});

export default posSessionQueries;
