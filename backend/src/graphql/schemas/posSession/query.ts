import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString
} from "graphql";
import { camelizeKeys } from "humps";
import { ApolloError } from "apollo-server-lambda";

import { configureService, getDataSet } from "../utility/nodoo";
import { PaginateType } from "../utility/types/paginateType";
import { PosSessionType } from "./types/posSession";
import { FilterableAndPagableInputType } from "../utility/types/FilterableAndPageableInputType";
import posSessionFields from "./fields";
import { paginateOperationParam } from "../utility/paginate";

const posSessionQueries = new GraphQLObjectType({
  name: "posCategoryQueries",
  fields: () => ({
    posSession: {
      type: PaginateType(PosSessionType),
      args: {
        input: {
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "PosSessionInput",
              fields: () => ({
                name: {
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "pos.session",
                  fields: posSessionFields.posSession,
                  domain: [["state", "=", "opened"], ["user_id", "=", 1]]
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
    }
  })
});

export default posSessionQueries;
