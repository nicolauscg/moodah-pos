import { GraphQLObjectType } from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getSessionAuthNone } from "../utility/nodoo";
import { SignInType } from "./types/signIn";
import { SignInInputType } from "./types/signInInput";

const authMutations = new GraphQLObjectType({
  name: "authMutations",
  fields: () => ({
    signIn: {
      type: SignInType,
      args: {
        input: {
          type: SignInInputType
        }
      },
      resolve: (_0, args) =>
        new Promise((res, rej) => {
          configureService({
            operation: getSessionAuthNone().createAuthenticate({
              db: args.input.db,
              login: args.input.username,
              password: args.input.password
            }),
            onError: error => {
              rej(
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

                res({
                  username,
                  isSuperuser,
                  sessionToken
                });
              } else {
                rej(
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

export default authMutations;
