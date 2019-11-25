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
    type: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    saleOk: {
      type: GraphQLBoolean
    },
    purchaseOk: {
      type: GraphQLBoolean
    },
    categId: {
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
    listPrice: {
      type: GraphQLFloat
    },
    standardPrice: {
      type: GraphQLFloat
    }
  })
});

export { CreateOrUpdatePosProductInputType };
