import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import {
  httpController,
  createService,
  createInsecureClientOptions
} from "nodoo";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

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
          const dataSet = httpController().operation.dataSet({
            sessionToken: context.sessionToken
          });

          const clientOptions = createInsecureClientOptions({
            host: "178.128.103.135",
            port: 8069
          });

          const operation = dataSet.createSearchRead({
            modelName: "pos.config",
            fields: ["name", "active"],
            domain: []
          });

          createService({
            operation,
            clientOptions
          }).addListener({
            next: result => {
              result.fold(
                onError => {
                  reject(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: onError.message
                    })
                  );
                },
                onResult => {
                  resolve(onResult.records);
                }
              );
            }
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
          const clientOptions = createInsecureClientOptions({
            host: "178.128.103.135",
            port: 8069
          });

          const sessionAuthNone = httpController().operation.session.authNone;

          const operation = sessionAuthNone.createAuthenticate({
            db: args.input.db,
            login: args.input.username,
            password: args.input.password
          });

          createService({
            operation,
            clientOptions
          }).addListener({
            next: result => {
              result.fold(
                onError => {
                  reject(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: onError.message
                    })
                  );
                },
                onResult => {
                  const camelizedResult: any = camelizeKeys(onResult);
                  console.log(camelizedResult);
                  if (camelizedResult.username) {
                    const sessionToken =
                      camelizedResult.username !== false
                        ? camelizedResult.sessionId
                        : null;
                    const { username, isSuperuser } = camelizedResult;

                    resolve(
                      camelizeKeys({
                        username,
                        isSuperuser,
                        sessionToken
                      })
                    );
                  } else {
                    // mutation will return null values for invalid credentials
                    resolve({});
                  }
                }
              );
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
