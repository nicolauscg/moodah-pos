import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from "graphql";
import { globalIdField } from "graphql-relay";

const categoryIdType = new GraphQLObjectType({
  name: "categoryId",
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

const PosProductType = new GraphQLObjectType({
  name: "PosProduct",
  fields: () => ({
    id: globalIdField("pos.product"),
    name: {
      type: GraphQLString
    },
    productType: {
      type: GraphQLString,
      resolve: parent => parent.type
    },
    image: {
      type: GraphQLString,
      resolve: parent =>
          (parent.imageMedium === false ? null : parent.imageMedium)
    },
    canBeSold: {
      type: GraphQLBoolean,
      resolve: parent => parent.saleOk
    },
    canBePurchased: {
      type: GraphQLBoolean,
      resolve: parent => parent.purchaseOk
    },
    category: {
      type: categoryIdType,
      resolve: parent => parent.categId
    },
    internalReference: {
      type: GraphQLString,
      resolve: parent => parent.defaultCode
    },
    barcode: {
      type: GraphQLString,
      resolve: parent => (parent.barcode === false ? null : parent.barcode)
    },
    HSCode: {
      type: GraphQLString,
      resolve: parent => parent.hsCode
    },
    salesPrice: {
      type: GraphQLFloat,
      resolve: parent => parent.listPrice
    },
    cost: {
      type: GraphQLFloat,
      resolve: parent => parent.standardPrice
    },

    /* For fetching data that is represented on the
       upper right corner of the UI/UX demo in nodoo */
    sales: {
      type: GraphQLInt,
      resolve: parent => parent.salesCount
    },
    purchases: {
      type: GraphQLInt,
      resolve: parent => parent.purchaseCount
    },
    archive: {
      type: GraphQLBoolean,
      resolve: parent => parent.active
    },
    onHand: {
      type: GraphQLBoolean,
      resolve: parent => parent.qtyAvailable
    },
    forecastedQuantity: {
      type: GraphQLFloat,
      resolve: parent => parent.virtualAvaiable
    },
    reorderingRules: {
      type: GraphQLInt,
      resolve: parent => parent.nbrReorderingRules
    }
  })
});

export { PosProductType };
