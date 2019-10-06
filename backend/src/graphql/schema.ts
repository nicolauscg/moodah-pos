import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { getDataSet, getSessionAuthNone, configureService } from "./utils";

import { PosConfigType } from "./schemas/posConfig";
import { SignInType } from "./schemas/signIn";

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
          type: new GraphQLInputObjectType({
            name: "SignInInput",
            fields: () => ({
              db: {
                type: GraphQLString
              },
              username: {
                type: GraphQLString
              },
              password: {
                type: GraphQLString
              }
            })
          })
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
                const sessionToken =
                  camelizedResult.username !== false
                    ? camelizedResult.sessionId
                    : null;
                const { username, isSuperuser } = camelizedResult;

                resolve({
                  username,
                  isSuperuser,
                  sessionToken
                });
              } else {
                // mutation will return null values for invalid credentials
                resolve({});
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
