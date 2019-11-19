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
const GET_POS_SESSION = gql`
  query {
    posSession {
      length
      records {
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
  }
`;

export default {
  SIGN_IN,
  GET_POS_SESSION
};
