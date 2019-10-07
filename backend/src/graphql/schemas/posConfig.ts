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

const DiscountProductType = new GraphQLObjectType({
  name: "DiscountProduct",
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
const PriceListType = new GraphQLObjectType({
  name: "Pricelist",
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
const StockLocationType = new GraphQLObjectType({
  name: "StockLocation",
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
const PickingTypeType = new GraphQLObjectType({
  name: "PickingType",
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
      type: DiscountProductType,
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
      type: PriceListType
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
      type: StockLocationType,
      resolve: parent => parent.stockLocationId
    },
    pickingType: {
      type: PickingTypeType,
      resolve: parent => parent.pickingTypeId
    }
  })
});

export { PosConfigType };
