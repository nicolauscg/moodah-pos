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
// eslint-disable-next-line no-trailing-spaces

const PosProductType = new GraphQLObjectType({
  name: "PosProduct",
  fields: () => ({
    id: globalIdField("pos.product"),
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString,
      resolve: parent =>
        // eslint-disable-next-line prettier/prettier
          (parent.imageMedium === false ? null : parent.imageMedium)
    },
    canBeSold: {
      type: GraphQLBoolean,
      resolve: parent => parent.sale_ok
    },
    canBePurchased: {
      type: GraphQLBoolean,
      resolve: parent => parent.purchase_ok
    },
    category: {
      type: categoryIdType
    },
    internalReference: {
      type: GraphQLString
    },
    barcode: {
      type: GraphQLString,
      resolve: parent => (parent.barcode === false ? null : parent.barcode)
    },
    HSCode: {
      type: GraphQLString,
      resolve: parent => parent.hs_code
    },
    salesPrice: {
      type: GraphQLFloat,
      resolve: parent => parent.list_price
    },
    cost: {
      type: GraphQLFloat,
      resolve: parent => parent.standard_price
    },
    sales: {
      type: GraphQLInt,
      resolve: parent => parent.sales_count
    },
    purchases: {
      type: GraphQLInt,
      resolve: parent => parent.purchase_count
    },
    archive: {
      type: GraphQLBoolean,
      resolve: parent => parent.active
    }
  })
});

export { PosProductType };
