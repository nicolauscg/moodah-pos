import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const accountBankStatementType = new GraphQLObjectType({
  name: "accountBankStatementType",
  fields: () => ({
    account: {
      type: new GraphQLObjectType({
        name: "accountBankStatement_AccountId",
        fields: () => ({
          id: globalIdField("account.account", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.accountId
    },
    currency: {
      type: new GraphQLObjectType({
        name: "accountBankStatement_CurrencyId",
        fields: () => ({
          id: globalIdField("res.currency", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.currencyId
    },
    journal: {
      type: new GraphQLObjectType({
        name: "accountBankStatement_JournalId",
        fields: () => ({
          id: globalIdField("product.product", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.journalId
    },
    posSession: {
      type: new GraphQLObjectType({
        name: "accountBankStatement_posSessionId",
        fields: () => ({
          id: globalIdField("pos.session", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.posSessionId
    },
    user: {
      type: new GraphQLObjectType({
        name: "accountBankStatement_userId",
        fields: () => ({
          id: globalIdField("res.users", parent => parent[0]),
          name: {
            type: GraphQLString,
            resolve: parent => parent[1]
          }
        })
      }),
      resolve: parent => parent.posSessionId
    },
    state: {
      type: GraphQLString
    }
  })
});

export { accountBankStatementType };
