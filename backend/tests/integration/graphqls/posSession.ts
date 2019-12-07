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

function getUserQuery(id: string) {
  return gql`
    query {
      getUserInfo(input: { id: "${id}" }) {
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
          name: "Order ${date}"
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
            name: "2019-11-28 18:18:00"
            statementId: 224
            accountId: 52
            journalId: 11
            amount: 51000
          }
          posSessionId: 89
          pricelistId: 1
          partnerId: false
          userId: 1
          uid: "${date}"
          sequenceNumber: 7
          creationDate: "2019-11-27T12:01:00.000Z"
          fiscalPositionId: false
        }
        toInvoice: false
      }
    ) {
      result
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
  CREATE_POS_ORDER
};
