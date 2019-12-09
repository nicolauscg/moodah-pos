import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
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
    userId: {
      type: GraphQLInt
    },
    sequenceNumber: {
      type: GraphQLInt
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
    }
  })
});

export { PosOrderInputType };
