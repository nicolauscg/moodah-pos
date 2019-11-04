import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat
} from "graphql";
import { globalIdField } from "graphql-relay";
import { ProductTypeType } from "./productType";

const CategoryProductType = new GraphQLObjectType({
  name: "CategoryProduct",
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
  name: "PosProductType",
  fields: () => ({
    id: globalIdField("product.template"),
    name: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString,
      resolve: parent =>
        parent.imageMedium === false ? null : parent.imageMedium
    },
    canBeSold: {
      type: GraphQLBoolean,
      resolve: parent => parent.saleOk
    },
    canBePurchased: {
      type: GraphQLBoolean,
      resolve: parent => parent.purchaseOk
    },
    productType: {
      type: ProductTypeType,
      resolve: parent => parent.type
    },
    category: {
      type: CategoryProductType,
      resolve: parent => parent.categId
    },
    internalReference: {
      type: GraphQLString,
      resolve: parent =>
        parent.defaultCode === false ? null : parent.defaultCode
    },
    barcode: {
      type: GraphQLString,
      resolve: parent => (parent.barcode === false ? null : parent.barcode)
    },
    HSCode: {
      type: GraphQLString,
      resolve: parent => (parent.hsCode === false ? null : parent.hsCode)
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
      type: GraphQLFloat,
      resolve: parent => parent.qtyAvailable
    },
    forecastedQuantity: {
      type: GraphQLFloat,
      resolve: parent => parent.virtualAvailable
    },
    reorderingRules: {
      type: GraphQLInt,
      resolve: parent => parent.nbrReorderingRules
    }
  })
});

export { PosProductType };
