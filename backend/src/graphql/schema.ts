import { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import { httpController, createService, createInsecureClientOptions } from "nodoo";
import { ApolloError } from "apollo-server-lambda";

import { PosConfigType } from "./schemas/posConfig";

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
            fields: ["name", "active"],
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
                  resolve(result.records)
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
      type: new GraphQLObjectType({
        name: "SignInType",
        fields: () => ({
          sessionToken: {
            type: GraphQLString
          }
        })
      }),
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
                  resolve({sessionToken: result.session_id})
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
