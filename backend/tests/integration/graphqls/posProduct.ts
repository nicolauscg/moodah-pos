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
const GET_POS_PRODUCT = gql`
  query {
    posProducts {
      length
      records {
        id
        name
        saleOk
        purchaseOk
        image
        type
      }
    }
  }
`;

export default {
  SIGN_IN,
  GET_POS_PRODUCT
};
