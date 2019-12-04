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
      sequenceNumber
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

export default {
  SIGN_IN,
  GET_POS_SESSION,
  getUserQuery,
  OPEN_SESSION,
  CLOSE_SESSION
};
