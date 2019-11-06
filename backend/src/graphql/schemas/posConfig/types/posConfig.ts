import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList
} from "graphql";
import { globalIdField } from "graphql-relay";
import { IfaceTaxIncludedType } from "./ifaceTaxIncluded";

const PosConfigDiscountProductType = new GraphQLObjectType({
  name: "PosConfig_DiscountProduct",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

const PosConfigPriceListType = new GraphQLObjectType({
  name: "PosConfig_Pricelist",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

const PosConfigStockLocationType = new GraphQLObjectType({
  name: "PosConfig_StockLocation",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

const PosConfigPickingTypeType = new GraphQLObjectType({
  name: "PosConfig_PickingType",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: parent => parent[0]
    },
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

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
      type: PosConfigDiscountProductType,
      resolve: parent => parent.discountProductId
    },
    discountPc: {
      type: GraphQLFloat
    },
    usePricelist: {
      type: GraphQLBoolean
    },
    availablePricelistIds: {
      type: GraphQLList(GraphQLInt)
    },
    pricelist: {
      type: PosConfigPriceListType,
      resolve: parent => parent.pricelistId
    },
    restrictPriceControl: {
      type: GraphQLBoolean
    },
    journalIds: {
      type: GraphQLList(GraphQLInt)
    },
    isHeaderOrFooter: {
      type: GraphQLBoolean
    },
    receiptHeader: {
      type: GraphQLString
    },
    receiptFooter: {
      type: GraphQLString
    },
    stockLocation: {
      type: PosConfigStockLocationType,
      resolve: parent => parent.stockLocationId
    },
    pickingType: {
      type: PosConfigPickingTypeType,
      resolve: parent => parent.pickingTypeId
    }
  })
});

export { PosConfigType };
