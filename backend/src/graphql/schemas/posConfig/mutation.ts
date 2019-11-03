import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys, decamelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { CreatePosConfigType } from "./types/createPosConfig";
import { CreateOrUpdatePosConfigInputType } from "./types/createOrUpdatePosConfigInput";
import { UpdateOrDeletePosConfigType } from "./types/updateOrDeletePosConfig";
import posConfigFields from "./fields";
import { GlobalIdInput } from "../utility/types/globalIdInput";

const posConfigMutations = new GraphQLObjectType({
  name: "posConfigMutations",
  fields: () => ({
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
                  fields: posConfigFields.posConfig,
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
              configureService({
                operation: getDataSet({ context }).createRead({
                  modelName: "pos.config",
                  ids: [updateResult.posConfig.id],
                  fields: posConfigFields.posConfig,
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
                type: GlobalIdInput
              }
            })
          })
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({ context }).createRead({
              modelName: "pos.config",
              ids: [args.input.id],
              fields: posConfigFields.posConfig,
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
          (readResult: any) =>
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
                onResult: result => {
                  readResult.success = result;
                  res(readResult);
                }
              });
            })
        )
    }
  })
});

export default posConfigMutations;
