import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList
} from "graphql";
import { IfaceTaxIncludedType } from "./ifaceTaxIncluded";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const CreateOrUpdatePosConfigInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosConfigInputType",
  fields: () => ({
    id: {
      type: GlobalIdInput
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
      type: GlobalIdInput
    },
    discountPc: {
      type: GraphQLFloat
    },
    usePricelist: {
      type: GraphQLBoolean
    },
    availablePricelistIds: {
      type: GraphQLList(GlobalIdInput)
    },
    pricelistId: {
      type: GlobalIdInput
    },
    restrictPriceControl: {
      type: GraphQLBoolean
    },
    journalIds: {
      type: GraphQLList(GlobalIdInput)
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
    stockLocationId: {
      type: GlobalIdInput
    },
    pickingTypeId: {
      type: GlobalIdInput
    }
  })
});

export { CreateOrUpdatePosConfigInputType };
