import { GraphQLObjectType, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { camelizeKeys } from "humps";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { paginateOperationParam } from "../utility/paginate";
import { PaginateType } from "../utility/types/paginateType";
import { PagableInputType } from "../utility/types/pagableInput";
import { PosCategoryType } from "./types/posCategory";
import posCategoryFields from "./fields";

const posCategoryQueries = new GraphQLObjectType({
  name: "posCategoryQueries",
  fields: () => ({
    posCategories: {
      type: PaginateType(PosCategoryType),
      args: {
        input: {
          type: PagableInputType,
          defaultValue: {
            first: 10,
            offset: 0
          }
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "pos.category",
                  fields: posCategoryFields.posCategory,
                  domain: []
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
            onResult: result => {
              result.records.forEach(
                record => record.image || (record.image = null)
              );
              res({
                length: result.length,
                records: camelizeKeys(result.records)
              });
            }
          });
        })
    },
    posCategory: {
      type: PosCategoryType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosCategoryInput",
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
              modelName: "pos.category",
              fields: posCategoryFields.posCategory
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
    }
  })
});

export default posCategoryQueries;
