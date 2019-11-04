import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys, decamelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { UpdateOrDeletePosProductType } from "./types/updateOrDeletePosProduct";
import { CreatePosProductType } from "./types/createPosProduct";
import { CreateOrUpdatePosProductInputType } from "./types/createOrUpdatePosProductInput";
import posProductFields from "./fields";

const posProductMutations = new GraphQLObjectType({
  name: "posProductMutations",
  fields: () => ({
    createPosProduct: {
      type: CreatePosProductType,
      args: {
        input: {
          type: CreateOrUpdatePosProductInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({ context }).createCreate({
              modelName: "product.template",
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
                  modelName: "product.template",
                  ids: [createResult.id],
                  fields: posProductFields.posProduct,
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
                    createResult.posProduct = camelizedReadResult;
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
    updatePosProduct: {
      type: UpdateOrDeletePosProductType,
      args: {
        input: {
          type: CreateOrUpdatePosProductInputType
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          const fieldsValues = args.input;
          const decamelizedFieldValues: any = decamelizeKeys(fieldsValues);
          configureService({
            operation: getDataSet({ context }).createUpdate({
              modelName: "product.template",
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
                  posProduct: {
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
                  modelName: "product.template",
                  ids: [updateResult.posProduct.id],
                  fields: posProductFields.posProduct,
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
                    updateResult.posProduct = camelizedReadResult;
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
    deletePosProduct: {
      type: UpdateOrDeletePosProductType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "DeletePosProductInputType",
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
            operation: getDataSet({ context }).createRead({
              modelName: "product.template",
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
              if (result.length) {
                const camelizedReadResult = camelizeKeys(result[0]);

                res({ posProduct: camelizedReadResult });
              }

              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: result.message
                })
              );
            }
          });
        }).then(
          (result: any) =>
            new Promise((res, rej) => {
              configureService({
                operation: getDataSet({ context }).createDelete({
                  modelName: "product.template",
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
    }
  })
});

export default posProductMutations;
