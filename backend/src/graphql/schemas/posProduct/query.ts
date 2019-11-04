import { GraphQLObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import {
  paginateAndFilterOperationParam,
  isFilterArgsValid
} from "../utility/filterAndPaginate";
import { PaginateType } from "../utility/types/paginateType";
import { PagableInputType } from "../utility/types/pagableInput";
import { PosProductType } from "./types/posProduct";
import posProductFields from "./fields";
import posProductFilter from "./filter";

const posProductQueries = new GraphQLObjectType({
  name: "posProductQueries",
  fields: () => ({
    posProducts: {
      type: PaginateType(PosProductType),
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
                  modelName: "product.template",
                  fields: posProductFields.posProducts,
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
    }
  })
});

export default posProductQueries;
