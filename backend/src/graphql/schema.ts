import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { getDataSet, getSessionAuthNone, configureService } from "./utils";

import { PosConfigType } from "./schemas/posConfig";
import { SignInType } from "./schemas/signIn";
import { SignInInputType } from "./schemas/signInInput";
import { DeletePosConfigType } from "./schemas/deletePosConfig";

const POS_CONFIG_FIELDS = [
  "id",
  "name",
  "active",
  "iface_tax_included",
  "module_pos_discount",
  "discount_product_id",
  "discount_pc",
  "use_pricelist",
  "available_pricelist_ids",
  "price_list_id",
  "restrict_price_control",
  "journal_ids",
  "is_header_or_footer",
  "receipt_header",
  "receipt_footer",
  "stock_location_id",
  "picking_type_id"
];

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
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead({
              modelName: "pos.config",
              fields: POS_CONFIG_FIELDS,
              domain: []
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => res(camelizeKeys(result.records))
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
    },
    deletePosConfig: {
      type: DeletePosConfigType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "DeletePosConfigInputType",
            fields: () => ({
              id: {
                type: GraphQLInt
              }
            })
          })
        }
      },
      resolve: (_0, args, context) =>
        new Promise((res, rej) => {
          // read pos config with id specified
          configureService({
            operation: getDataSet({ context }).createRead({
              modelName: "pos.config",
              ids: [args.input.id],
              fields: POS_CONFIG_FIELDS,
              kwargs: {}
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => {
              if (result.length) {
                const camelizedReadResult = camelizeKeys(result[0]);

                res({ posConfig: camelizedReadResult });
              }

              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: result.message
                })
              );
            }
          });
        }).then(
          // delete pos config with id specified
          (result: any) =>
            new Promise((res, rej) => {
              configureService({
                operation: getDataSet({ context }).createDelete({
                  modelName: "pos.config",
                  ids: [args.input.id],
                  kwargs: {}
                }),
                onError: error => {
                  rej(
                    new ApolloError("Application Error", "APPLICATION_ERROR", {
                      errorMessage: error.message
                    })
                  );
                },
                onResult: result2 => {
                  result.success = result2;
                  res(result);
                }
              });
            })
        )
    }
  })
});

export const schema = new GraphQLSchema({
  query: rootType,
  mutation: mutationType
});
