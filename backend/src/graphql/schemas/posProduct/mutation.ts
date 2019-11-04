import { GraphQLObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys, decamelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
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
    }
  })
});

export default posProductMutations;
