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
  OPEN_SESSION,
  CLOSE_SESSION
};
