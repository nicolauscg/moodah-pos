import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInt
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import { paginateOperationParam } from "../utility/paginate";
import {
  paginateAndFilterOperationParam,
  isFilterArgsValid
} from "../utility/filterAndPaginate";
import { PaginateType } from "../utility/types/paginateType";
import { FilterableAndPagableInputType } from "../utility/types/FilterableAndPageableInputType";
import { PagableInputType } from "../utility/types/pagableInput";
import { PosConfigType } from "./types/posConfig";
import { PaymentMethodType } from "./types/paymentMethod";
import { AvailablePriceListType } from "./types/availablePriceList";
import { OperationTypesType } from "./types/operationType";
import { StockLocationType } from "./types/stockLocation";
import { DiscountProductType } from "./types/discountProduct";
import posConfigFields from "./fields";
import posConfigsFilter from "./filter";

const posConfigQueries = new GraphQLObjectType({
  name: "posConfigQueries",
  fields: () => ({
    posConfigs: {
      type: PaginateType(PosConfigType),
      args: {
        input: {
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "PosConfigsInput",
              fields: () => ({
                name: {
                  type: GraphQLString
                },
                stockLocationName: {
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
                  modelName: "pos.config",
                  fields: posConfigFields.posConfig,
                  domain: []
                },
                posConfigsFilter.posConfig,
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
    },
    posConfig: {
      type: PosConfigType,
      args: {
        input: {
          type: new GraphQLInputObjectType({
            name: "PosConfigInput",
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
          configureService({
            operation: getDataSet({
              context
            }).createRead({
              ids: [args.input.id],
              modelName: "pos.config",
              fields: posConfigFields.posConfig
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
    },
    paymentMethods: {
      type: PaginateType(PaymentMethodType),
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "account.journal",
                  fields: ["id", "name", "company_id"],
                  domain: [
                    ["journal_user", "=", true],
                    ["type", "in", ["bank", "cash"]]
                  ]
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
    },
    availablePriceLists: {
      type: PaginateType(AvailablePriceListType),
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "product.pricelist",
                  fields: ["id", "name", "currency_id"],
                  domain: []
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
    },
    operationTypes: {
      type: PaginateType(OperationTypesType),
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "stock.picking.type",
                  fields: posConfigFields.posConfig,
                  domain: []
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
    },
    stockLocations: {
      type: PaginateType(StockLocationType),
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "stock.location",
                  fields: posConfigFields.posConfig,
                  domain: []
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
    },
    discountProducts: {
      type: PaginateType(DiscountProductType),
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
          configureService({
            operation: getDataSet({
              context
            }).createSearchRead(
              paginateOperationParam(
                {
                  modelName: "product.product",
                  fields: ["id", "name"],
                  domain: [
                    ["available_in_pos", "=", true],
                    ["sale_ok", "=", true]
                  ]
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

export default posConfigQueries;
