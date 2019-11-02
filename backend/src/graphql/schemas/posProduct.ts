import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat
} from "graphql";
import { globalIdField } from "graphql-relay";

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
    type: {
      type: GraphQLString
    },
    barcode: {
      type: GraphQLString,
      resolve: parent => (parent.barcode === false ? null : parent.barcode)
    },
    hsCode: {
      type: GraphQLString,
      resolve: parent => (parent.hsCode === false ? null : parent.hsCode)
    },
    defaultCode: {
      type: GraphQLString,
      resolve: parent =>
        parent.defaultCode === false ? null : parent.defaultCode
    },
    listPrice: {
      type: GraphQLFloat
    },
    standardPrice: {
      type: GraphQLFloat
    },
    categId: {
      type: CategoryProductType,
      resolve: parent => parent.categId
    },
    saleOk: {
      type: GraphQLBoolean
    },
    purchaseOk: {
      type: GraphQLBoolean
    }
  })
});

export { PosProductType };
