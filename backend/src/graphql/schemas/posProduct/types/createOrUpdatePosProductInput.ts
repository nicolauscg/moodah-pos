import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLBoolean
} from "graphql";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const CreateOrUpdatePosProductInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosProductInput",
  fields: () => ({
    id: {
      type: GlobalIdInput
    },
    name: {
      type: GraphQLString
    },
    productType: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    canBeSold: {
      type: GraphQLBoolean
    },
    canBePurchased: {
      type: GraphQLBoolean
    },
    category: {
      type: GlobalIdInput
    },
    defaultCode: {
      type: GraphQLString
    },
    barcode: {
      type: GraphQLString
    },
    hsCode: {
      type: GraphQLString
    },
    salesPrice: {
      type: GraphQLFloat
    },
    cost: {
      type: GraphQLFloat
    }
  })
});

export { CreateOrUpdatePosProductInputType };
