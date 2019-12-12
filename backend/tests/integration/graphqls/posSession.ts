import gql from "graphql-tag";

const SIGN_IN = gql`
  mutation {
    signIn(input: {
      db: "${process.env.odoo_db}",
      username: "${process.env.odoo_username}",
      password: "${process.env.odoo_password}"
    }) {
      sessionToken
    }
  }
`;
const GET_POS_SESSION = id => gql`
  query {
    posSession (input: { id: "${id}" }) {
      id
      name
      startSession
      journalId {
        id
      }
      userId {
        id
        name
      }
      configurationId {
        id
        name
      }
      sequenceNumber
    }
  }
`;

function getUserQuery(id: number) {
  return gql`
    query {
      getUserInfo(input: { id: ${id} }) {
        id
        name
        function
        company {
          id
          name
        }
        image
      }
    }
  `;
}

const OPEN_SESSION = id => gql`
  mutation {
    openSession(input: {id: "${id}"}) {
      sessionId
    }
  }
`;

const CLOSE_SESSION = id => gql`
  mutation {
    closeSession(input: {id: "${id}"}) {
      success
    }
  }
`;

const GET_ACCOUNT_BANK_STATEMENT = id => gql`
  query {
    accountBankStatement(input: { id: "${id}" }) {
      length
      records {
        currency {
          id
          name
        }
        account {
          id
          name
        }
        journal {
          id
          name
        }
        state
        posSession {
          id
          name
        }
        user {
          id
          name
        }
      }
    }
  }
`;
const date = new Date();
const CREATE_POS_ORDER = gql`
  mutation {
    posOrder(
      input: {
        id: "${date}"
        data: {
          amountPaid: 51000
          amountTotal: 51000
          amountTax: 0
          amountReturn: 0
          lines: [
            { qty: 1, priceUnit: 15000, discount: 0, productId: 186, id: 15 }
            { qty: 2, priceUnit: 15000, discount: 0, productId: 187, id: 16 }
            { qty: 1, priceUnit: 6000, discount: 0, productId: 183, id: 18 }
          ]
          statementIds: {
            statementId: 224
            accountId: 52
            journalId: 11
            amount: 51000
          }
          posSessionId: 89
          pricelistId: 1
          userId: 1
          sequenceNumber: 1
        }
      }
    ) {
      result
    }
  }
`;
const POS_SESSION_SUMMARY = gql`
  query {
    posSessionSummary(input: { id: "cG9zLnNlc3Npb246NDI3" }) {
      totalNetSale
      transactions
      averageOrderValue
    }
  }
`;

export default {
  SIGN_IN,
  GET_POS_SESSION,
  getUserQuery,
  OPEN_SESSION,
  CLOSE_SESSION,
  GET_ACCOUNT_BANK_STATEMENT,
  CREATE_POS_ORDER,
  POS_SESSION_SUMMARY
};
