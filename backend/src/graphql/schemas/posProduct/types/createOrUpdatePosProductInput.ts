import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from "graphql";

const CreateOrUpdatePosProductInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosProductInput",
  fields: () => ({
    id: {
      type: GraphQLInt
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
      type: GraphQLInt
    },
    internalReference: {
      type: GraphQLString
    },
    barcode: {
      type: GraphQLString
    },
    HSCode: {
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
