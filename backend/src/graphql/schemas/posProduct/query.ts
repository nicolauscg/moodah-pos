import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import {
  paginateAndFilterOperationParam,
  isFilterArgsValid
} from "../utility/filterAndPaginate";
import { PaginateType } from "../utility/types/paginateType";
import { PosProductType } from "./types/posProduct";
import posProductFields from "./fields";
import posProductFilter from "./filter";
import { CategoryType } from "./types/category";
import { GlobalIdInput } from "../utility/types/globalIdInput";
import { FilterableAndPagableInputType } from "../utility/types/FilterableAndPageableInputType";

const posProductQueries = new GraphQLObjectType({
  name: "posProductQueries",
  fields: () => ({
    posProducts: {
      type: PaginateType(PosProductType),
      args: {
        input: {
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "PosProductsInput",
              fields: () => ({
                name: {
                  type: GraphQLString
                },
                barcode: {
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
                  modelName: "product.template",
                  fields: posProductFields.posProduct,
                  domain: [["available_in_pos", "=", true]]
                },
                posProductFilter.posProducts,
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
    posProduct: {
      type: PosProductType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosProductInput",
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
              modelName: "product.template",
              fields: posProductFields.posProduct
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
    categories: {
      type: PaginateType(CategoryType),
      args: {
        input: {
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "CategoriesInput",
              fields: () => ({
                name: {
                  type: GraphQLString
                },
                barcode: {
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
                  modelName: "product.category",
                  fields: ["id", "name"],
                  domain: []
                },
                posProductFilter.categories,
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
    }
  })
});

export default posProductQueries;
