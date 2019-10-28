import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType
} from "graphql";

import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys, decamelizeKeys } from "humps";

import {
  getDataSet,
  getSessionAuthNone,
  configureService,
  isFilterArgsValid,
  paginateAndFilterOperationParam
} from "./utils";

import { PaginateType } from "./schemas/paginateType";
import { PosConfigType } from "./schemas/posConfig";
import { SignInType } from "./schemas/signIn";
import { SignInInputType } from "./schemas/signInInput";
import { CreatePosConfigType } from "./schemas/createPosConfig";
import { UpdateOrDeletePosConfigType } from "./schemas/updateOrDeletePosConfig";
import { CreateOrUpdatePosConfigInputType } from "./schemas/createOrUpdatePosConfigInput";
import { FilterableAndPagableInputType } from "./schemas/FilterableAndPageableInputType";

const POS_CONFIG_FIELDS = [
  "id",
  "name",
  "active",
  "iface_tax_included",
  "module_pos_discount",
  "discount_product_id",
  "discount_pc",
  "use_pricelist",
  "available_pricelist_ids",
  "pricelist_id",
  "restrict_price_control",
  "journal_ids",
  "is_header_or_footer",
  "receipt_header",
  "receipt_footer",
  "stock_location_id",
  "picking_type_id"
];

const rootType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    test: {
      type: GraphQLString,
      resolve: () => "test"
    },
    posConfigs: {
      type: PaginateType(PosConfigType),
      args: {
        input: {
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "PosConfigsInput",
              fields: () => ({
                name: {
                  type: GraphQLString
                },
                stockLocationName: {
                  type: GraphQLString
                }
              })
            })
          ),
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
              paginateAndFilterOperationParam(
                {
                  modelName: "pos.config",
                  fields: POS_CONFIG_FIELDS
                },
                [
                  {
                    domainName: "name",
                    conventionName: "name",
                    operator: "ilike"
                  },
                  {
                    domainName: "stock_location_id",
                    conventionName: "stockLocationName",
                    operator: "ilike"
                  }
                ],
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
            onResult: result => {
              res({
                length: result.length,
                records: camelizeKeys(result.records)
              });
            }
          });
        })
    },
    posConfig: {
      type: PosConfigType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosConfigInput",
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
              modelName: "pos.config",
              fields: POS_CONFIG_FIELDS
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
                // array empty or does not have a matching id
              } else {
                res(camelizeKeys(result[0]));
              }
            }
          });
        })
    }
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    signIn: {
      type: SignInType,
      args: {
        input: {
          type: SignInInputType
        }
      },
      resolve: (_0, args) =>
        new Promise((res, rej) => {
          configureService({
            operation: getSessionAuthNone().createAuthenticate({
              db: args.input.db,
              login: args.input.username,
              password: args.input.password
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              const camelizedResult: any = camelizeKeys(result);
              if (camelizedResult.username) {
                const sessionToken = camelizedResult.sessionId;
                const { username, isSuperuser } = camelizedResult;

                res({
                  username,
                  isSuperuser,
                  sessionToken
                });
              } else {
                rej(
                  new ApolloError("Application Error", "APPLICATION_ERROR", {
                    errorMessage: result.message
                  })
                );
              }
            }
          });
        })
    },
    updatePosConfig: {
      type: UpdateOrDeletePosConfigType,
      args: {
        input: {
          type: CreateOrUpdatePosConfigInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          // update pos config with id specified
          const fieldsValues = args.input;
          ["availablePricelistIds", "journalIds"].forEach(fieldName => {
            if (fieldsValues[fieldName] !== undefined) {
              fieldsValues[fieldName] = [6, false, fieldsValues[fieldName]];
            }
          });
          const decamelizedFieldValues: any = decamelizeKeys(fieldsValues);
          configureService({
            operation: getDataSet({ context }).createUpdate({
              modelName: "pos.config",
              ids: [decamelizedFieldValues.id],
              fieldsValues: decamelizedFieldValues,
              kwargs: {}
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              if (result) {
                res({
                  success: result,
                  posConfig: {
                    id: decamelizedFieldValues.id
                  }
                });
              }

              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: result.message
                })
              );
            }
          });
        }).then(
          (updateResult: any) =>
            new Promise((res, rej) => {
              // read pos config with id specified
              configureService({
                operation: getDataSet({ context }).createRead({
                  modelName: "pos.config",
                  ids: [updateResult.posConfig.id],
                  fields: POS_CONFIG_FIELDS,
                  kwargs: {}
                }),
                onError: error => {
                  rej(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: error.message
                    })
                  );
                },
                onResult: result => {
                  if (result.length) {
                    const camelizedReadResult = camelizeKeys(result[0]);
                    updateResult.posConfig = camelizedReadResult;
                    res(updateResult);
                  }

                  rej(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: result.message
                    })
                  );
                }
              });
            })
        )
    },
    deletePosConfig: {
      type: UpdateOrDeletePosConfigType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "DeletePosConfigInputType",
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
          // read pos config with id specified
          configureService({
            operation: getDataSet({ context }).createRead({
              modelName: "pos.config",
              ids: [args.input.id],
              fields: POS_CONFIG_FIELDS,
              kwargs: {}
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              if (result.length) {
                const camelizedReadResult = camelizeKeys(result[0]);

                res({ posConfig: camelizedReadResult });
              }

              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: result.message
                })
              );
            }
          });
        }).then(
          // delete pos config with id specified
          (result: any) =>
            new Promise((res, rej) => {
              configureService({
                operation: getDataSet({ context }).createDelete({
                  modelName: "pos.config",
                  ids: [args.input.id],
                  kwargs: {}
                }),
                onError: error => {
                  rej(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: error.message
                    })
                  );
                },
                onResult: result2 => {
                  result.success = result2;
                  res(result);
                }
              });
            })
        )
    },
    createPosConfig: {
      type: CreatePosConfigType,
      args: {
        input: {
          type: CreateOrUpdatePosConfigInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          const fieldsValues = args.input;
          ["availablePricelistIds", "journalIds"].forEach(fieldName => {
            if (fieldsValues[fieldName] !== undefined) {
              fieldsValues[fieldName] = [6, false, fieldsValues[fieldName]];
            }
          });
          const decamelizedFieldValues: any = decamelizeKeys(fieldsValues);
          configureService({
            operation: getDataSet({ context }).createCreate({
              modelName: "pos.config",
              fieldsValues: decamelizedFieldValues,
              kwargs: {}
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              res({ id: result });
            }
          });
        }).then(
          (createResult: any) =>
            new Promise((res, rej) => {
              configureService({
                operation: getDataSet({ context }).createRead({
                  modelName: "pos.config",
                  ids: [createResult.id],
                  fields: POS_CONFIG_FIELDS,
                  kwargs: {}
                }),
                onError: error => {
                  rej(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: error.message
                    })
                  );
                },
                onResult: result2 => {
                  const camelizedResult = camelizeKeys(result2[0]);
                  createResult.posConfig = camelizedResult;
                  res(createResult);
                }
              });
            })
        )
    }
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
