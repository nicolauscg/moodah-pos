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

function getUserQuery(id: string) {
  return gql`
    query {
      resUser(input: { id: "${id}" }) {
        id
        name
        company {
          id
          name
        }
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

export default {
  SIGN_IN,
  getUserQuery,
  OPEN_SESSION,
  CLOSE_SESSION
};
