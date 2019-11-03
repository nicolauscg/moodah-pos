import { GraphQLObjectType, GraphQLInputObjectType } from "graphql";
import { camelizeKeys } from "humps";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { PaginateType } from "../utility/types/paginateType";
import { PagableInputType } from "../utility/types/pagableInput";
import { PosCategoryType } from "./types/posCategory";
import {
  paginateAndFilterOperationParam,
  isFilterArgsValid
} from "../utility/filterAndPaginate";
import posCategoryFields from "./fields";
import posCategoryFilter from "./filter";
import { GlobalIdInput } from "../utility/types/globalIdInput";

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
                  modelName: "pos.category",
                  fields: posCategoryFields.posCategory,
                  domain: []
                },
                posCategoryFilter.posCategories,
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
    posCategory: {
      type: PosCategoryType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosCategoryInput",
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
