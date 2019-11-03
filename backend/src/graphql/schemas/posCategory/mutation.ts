import { GraphQLObjectType, GraphQLInputObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys, decamelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { CreatePosCategoryType } from "./types/CreatePosCategory";
import { CreateOrUpdatePosCategoryInputType } from "./types/createOrUpdatePosCategoryInput";
import { UpdateOrDeletePosCategoryType } from "./types/updateOrDeletePosCategory";
import posCategoryFields from "./fields";
import { GlobalIdInput } from "../utility/types/globalIdInput";

const posCategoryMutations = new GraphQLObjectType({
  name: "posCategoryMutations",
  fields: () => ({
    createPosCategory: {
      type: CreatePosCategoryType,
      args: {
        input: {
          type: CreateOrUpdatePosCategoryInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({ context }).createCreate({
              modelName: "pos.category",
              fieldsValues: decamelizeKeys(args.input),
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
                  modelName: "pos.category",
                  ids: [createResult.id],
                  fields: posCategoryFields.posCategory,
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
                    createResult.posCategory = camelizedReadResult;
                    res(createResult);
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
    updatePosCategory: {
      type: UpdateOrDeletePosCategoryType,
      args: {
        input: {
          type: CreateOrUpdatePosCategoryInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          const fieldsValues = args.input;
          const decamelizedFieldValues: any = decamelizeKeys(fieldsValues);
          configureService({
            operation: getDataSet({ context }).createUpdate({
              modelName: "pos.category",
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
                  posCategory: {
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
                  modelName: "pos.category",
                  ids: [updateResult.posCategory.id],
                  fields: posCategoryFields.posCategory,
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
                    updateResult.posCategory = camelizedReadResult;
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
    deletePosCategory: {
      type: UpdateOrDeletePosCategoryType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "DeletePosCategoryInputType",
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
              modelName: "pos.category",
              ids: [args.input.id],
              fields: posCategoryFields.posCategory,
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

                res({ posCategory: camelizedReadResult });
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
                  modelName: "pos.category",
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

export default posCategoryMutations;
