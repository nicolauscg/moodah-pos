import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList
} from "graphql";
import { IfaceTaxIncludedType } from "./ifaceTaxIncluded";

const CreateOrUpdatePosConfigInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosConfigInputType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
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
    discountProductId: {
      type: GraphQLInt
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
    pricelistId: {
      type: GraphQLInt
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
      type: GraphQLInt
    },
    pickingType: {
      type: GraphQLInt
    }
  })
});

export { CreateOrUpdatePosConfigInputType };
