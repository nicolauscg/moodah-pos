import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} from "graphql";
import { globalIdField } from "graphql-relay";
import { IfaceTaxIncludedType } from "./ifaceTaxIncluded";
import { configureService, getDataSet } from "../../utility/nodoo";
import { ApolloError } from "apollo-server-core";

const PosConfigType = new GraphQLObjectType({
  name: "PosConfig",
  fields: () => ({
    id: globalIdField("pos.config"),
    name: {
      type: GraphQLString
    },
    active: {
      type: GraphQLBoolean
    },
    ifaceTaxIncluded: {
      type: IfaceTaxIncludedType
    },
    globalDiscount: {
      type: GraphQLBoolean
    },
    discountProduct: {
      type: new GraphQLObjectType({
        name: "PosConfig_DiscountProduct",
        fields: () => ({
          id: globalIdField("product.product", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.discountProductId
    },
    discountPc: {
      type: GraphQLFloat
    },
    usePricelist: {
      type: GraphQLBoolean
    },
    availablePricelists: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: "PosConfig_AvailablePricelistIds",
          fields: () => ({
            id: globalIdField("product.pricelist"),
            name: {
              type: GraphQLString
            }
          })
        })
      ),
      resolve: (parent, _0, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createRead({
              modelName: "product.pricelist",
              ids: parent.availablePricelistIds,
              fields: ["id", "name"]
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => res(result)
          });
        })
    },
    pricelist: {
      type: new GraphQLObjectType({
        name: "PosConfig_Pricelist",
        fields: () => ({
          id: globalIdField("product.pricelist", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.pricelistId
    },
    restrictPriceControl: {
      type: GraphQLBoolean
    },
    paymentMethods: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: "PosConfig_JournalIds",
          fields: () => ({
            id: globalIdField("account.journal"),
            name: {
              type: GraphQLString
            }
          })
        })
      ),
      resolve: (parent, _0, context) =>
        new Promise((res, rej) => {
          configureService({
            operation: getDataSet({
              context
            }).createRead({
              modelName: "account.journal",
              ids: parent.journalIds,
              fields: ["id", "name"]
            }),
            onError: error => {
              rej(
                new ApolloError("Application Error", "APPLICATION_ERROR", {
                  errorMessage: error.message
                })
              );
            },
            onResult: result => res(result)
          });
        })
    },
    isHeaderOrFooter: {
      type: GraphQLBoolean
    },
    receiptHeader: {
      type: GraphQLString,
      resolve: parent =>
        parent.receiptHeader === false ? null : parent.receiptHeader
    },
    receiptFooter: {
      type: GraphQLString,
      resolve: parent =>
        parent.receiptFooter === false ? null : parent.receiptFooter
    },
    stockLocation: {
      type: new GraphQLObjectType({
        name: "PosConfig_StockLocation",
        fields: () => ({
          id: globalIdField("stock.location", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.stockLocationId
    },
    pickingType: {
      type: new GraphQLObjectType({
        name: "PosConfig_PickingType",
        fields: () => ({
          id: globalIdField("stock.picking.type", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.pickingTypeId
    }
  })
});

export { PosConfigType };
