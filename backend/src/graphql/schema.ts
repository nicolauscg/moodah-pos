import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { getDataSet, getSessionAuthNone, configureService } from "./utils";

import { PosConfigType } from "./schemas/posConfig";
import { SignInType } from "./schemas/signIn";
import { SignInInputType } from "./schemas/signInInput";

const rootType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    test: {
      type: GraphQLString,
      resolve: () => "test"
    },
    posConfigs: {
      type: GraphQLList(PosConfigType),
      resolve: (_0, _1, context) =>
        new Promise((resolve, reject) => {
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead({
              modelName: "pos.config",
              fields: ["name", "active"],
              domain: []
            }),
            onError: error => {
              reject(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => resolve(result)
          });
        })
    }
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    signIn: {
      type: SignInType,
      args: {
        input: {
          type: SignInInputType
        }
      },
      resolve: (_0, args) =>
        new Promise((resolve, reject) => {
          configureService({
            operation: getSessionAuthNone().createAuthenticate({
              db: args.input.db,
              login: args.input.username,
              password: args.input.password
            }),
            onError: error => {
              reject(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              const camelizedResult: any = camelizeKeys(result);
              if (camelizedResult.username) {
                const sessionToken = camelizedResult.sessionId;
                const { username, isSuperuser } = camelizedResult;

                resolve({
                  username,
                  isSuperuser,
                  sessionToken
                });
              } else {
                reject(
                  new ApolloError("Application Error", "APPLICATION_ERROR", {
                    errorMessage: result.message
                  })
                );
              }
            }
          });
        })
    }
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
