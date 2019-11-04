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
    posProducts(input: { first: 40, offset: 0 }) {
      length
      records {
        id
        name
        canBeSold
        canBePurchased
        productType
        category {
          id
          name
        }
        internalReference
        barcode
        HSCode
        salesPrice
        cost
        sales
        purchases
        archive
        onHand
        forecastedQuantity
        reorderingRules
      }
    }
  }
`;

const CREATE_POS_PRODUCT = gql`
  mutation {
    createPosProduct(input: { name: "createdFromTest" }) {
      id
      posProduct {
        id
        name
        canBeSold
        canBePurchased
        productType
        category {
          id
          name
        }
        internalReference
        barcode
        HSCode
        salesPrice
        cost
        sales
        purchases
        archive
        onHand
        forecastedQuantity
        reorderingRules
      }
    }
  }
`;
const getUpdatePosProductQuery = (fieldsToUpdate: string) => gql`
    mutation {
      updatePosProduct(input: ${fieldsToUpdate}) {
        success
        posProduct {
          id
          name
        }
      }
    }
  `;
const getDeletePosProductQuery = (id: number) => gql`
  mutation {
    deletePosProduct (input: {
      id: ${id}
    }) {
      success
      posProduct {
        id
        name
      }
    }
  }`;

export default {
  SIGN_IN,
  GET_POS_PRODUCT,
  CREATE_POS_PRODUCT,
  getUpdatePosProductQuery,
  getDeletePosProductQuery
};
