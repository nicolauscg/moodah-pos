import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean
} from "graphql";

const OrdersType = new GraphQLInputObjectType({
  name: "PosOrder_Orders",
  fields: () => ({
    qty: {
      type: GraphQLInt
    },
    priceUnit: {
      type: GraphQLInt
    },
    discount: {
      type: GraphQLInt
    },
    productId: {
      type: GraphQLInt
    },
    taxIds: {
      type: GraphQLInt
    },
    id: {
      type: GraphQLInt
    }
  })
});

const statementType = new GraphQLInputObjectType({
  name: "statementType",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    statementId: {
      type: GraphQLInt
    },
    accountId: {
      type: GraphQLInt
    },
    journalId: {
      type: GraphQLInt
    },
    amount: {
      type: GraphQLInt
    }
  })
});

const PosOrderDataType = new GraphQLInputObjectType({
  name: "posOrderData",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    amountPaid: {
      type: GraphQLInt
    },
    amountTotal: {
      type: GraphQLInt
    },
    amountTax: {
      type: GraphQLInt
    },
    amountReturn: {
      type: GraphQLInt
    },
    lines: {
      type: GraphQLList(OrdersType)
    },
    statementIds: {
      type: statementType
    },
    posSessionId: {
      type: GraphQLInt
    },
    pricelistId: {
      type: GraphQLInt
    },
    partnerId: {
      type: GraphQLBoolean
    },
    userId: {
      type: GraphQLInt
    },
    uid: {
      type: GraphQLString
    },
    sequenceNumber: {
      type: GraphQLInt
    },
    creationDate: {
      type: GraphQLString
    },
    fiscalPositionId: {
      type: GraphQLBoolean
    }
  })
});

const PosOrderInputType = new GraphQLInputObjectType({
  name: "posOrderInput",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    data: {
      type: PosOrderDataType
    },
    toInvoice: {
      type: GraphQLBoolean
    }
  })
});

export { PosOrderInputType };
