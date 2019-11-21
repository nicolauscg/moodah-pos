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

function getPosSessionQuery(id: string) {
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

export default {
  SIGN_IN,
  getPosSessionQuery
};
