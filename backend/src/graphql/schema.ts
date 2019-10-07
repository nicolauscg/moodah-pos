import { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import { httpController, createService, createInsecureClientOptions } from "nodoo";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { PosConfigType } from "./schemas/posConfig";
import { SignInType } from "./schemas/signIn";

const rootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    test: {
      type: GraphQLString,
      resolve: () => "test"
    },
    posConfigs: {
      type: GraphQLList(PosConfigType),
      resolve: (_parent, _args, context, _info) => new Promise(
        (resolve, reject) => {
          const dataSet = httpController().operation.dataSet({
            sessionToken: context.sessionToken
          })

          const clientOptions = createInsecureClientOptions({
            host: "178.128.103.135",
            port: 8069
          })

          const operation = dataSet.createSearchRead({
            modelName: "pos.config",
            fields: ["name", "active","stock_location_id"],
            domain: []
          })

          createService({
            operation: operation,
            clientOptions: clientOptions
          }).addListener({
            next: (result) => {
              result.fold(
                (error) => {
                  reject(new ApolloError("Application Error", "APPLICATION_ERROR", {
                    errorMessage: error.message
                  }))
                },
                (result) => {
                  resolve(camelizeKeys(result.records))
                }
              )
            }
          })
        }
      )
    }
  })
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
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
              },
            })
          })
        }
      },
      resolve: (_parent, args, _context, _info) => new Promise(
        (resolve, reject) => {
          const clientOptions = createInsecureClientOptions({
            host: "178.128.103.135",
            port: 8069
          })

          const sessionAuthNone = httpController().operation.session.authNone;

          const operation = sessionAuthNone.createAuthenticate({
            db: args.input.db,
            login: args.input.username,
            password: args.input.password
          });

          createService({
            operation: operation,
            clientOptions: clientOptions
          }).addListener({
            next: (result) => {
              result.fold(
                (error) => {
                  reject(new ApolloError("Application Error", "APPLICATION_ERROR", {
                    errorMessage: error.message
                  }))
                },
                (result) => {
                  if (result.username) {
                    const sessionToken = result.username !== false ? 
                      result.session_id : null;
                    const { username, is_superuser } = result;

                    resolve(camelizeKeys({ 
                      username, is_superuser, sessionToken
                    }))
                  } else {
                    // mutation will return null values for invalid credentials
                    resolve({})
                  }
                }
              )
            }
          })

        }
      )
    }
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
