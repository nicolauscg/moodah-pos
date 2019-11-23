import { GraphQLObjectType, GraphQLInputObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { GlobalIdInput } from "../utility/types/globalIdInput";
import { UserType } from "./types/user";
import posSessionFields from "./field";

const posSessionQueries = new GraphQLObjectType({
  name: "posSessionQueries",
  fields: () => ({
    getUserInfo: {
      type: UserType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "GetUserInfoInput",
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
              modelName: "res.users",
              fields: posSessionFields.userInfo
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

export default posSessionQueries;
