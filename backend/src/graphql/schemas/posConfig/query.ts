import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLObjectType
} from "graphql";
import { ApolloError } from "apollo-server-lambda";
import { camelizeKeys } from "humps";

import { configureService, getDataSet } from "../utility/nodoo";
import {
  paginateAndFilterOperationParam,
  isFilterArgsValid
} from "../utility/filterAndPaginate";
import { PaginateType } from "../utility/types/paginateType";
import { FilterableAndPagableInputType } from "../utility/types/FilterableAndPageableInputType";
import { PosConfigType } from "./types/posConfig";
import { PaymentMethodType } from "./types/paymentMethod";
import { AvailablePriceListType } from "./types/availablePriceList";
import { OperationTypesType } from "./types/operationType";
import { StockLocationType } from "./types/stockLocation";
import { DiscountProductType } from "./types/discountProduct";
import posConfigFields from "./fields";
import posConfigsFilter from "./filter";
import { GlobalIdInput } from "../utility/types/globalIdInput";

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
                posConfigsFilter.posConfigs,
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
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "PaymentMethodsInput",
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
                  modelName: "account.journal",
                  fields: ["id", "name", "display_name", "company_id"],
                  domain: [
                    ["journal_user", "=", true],
                    ["type", "in", ["bank", "cash"]]
                  ]
                },
                posConfigsFilter.paymentMethods,
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
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "AvailablePriceListsInput",
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
                  modelName: "product.pricelist",
                  fields: ["id", "name", "currency_id", "display_name"],
                  domain: []
                },
                posConfigsFilter.availablePriceLists,
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
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "OperationTypesInput",
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
                  modelName: "stock.picking.type",
                  fields: ["id", "name", "display_name"],
                  domain: []
                },
                posConfigsFilter.operationTypes,
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
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "StockLocationsInput",
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
                  modelName: "stock.location",
                  fields: ["id", "name", "display_name"],
                  domain: [["usage", "=", "internal"]]
                },
                posConfigsFilter.stockLocations,
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
          type: FilterableAndPagableInputType(
            new GraphQLInputObjectType({
              name: "DiscountProductsInput",
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
                  modelName: "product.product",
                  fields: ["id", "name", "display_name"],
                  domain: [
                    ["available_in_pos", "=", true],
                    ["sale_ok", "=", true]
                  ]
                },
                posConfigsFilter.discountProducts,
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
