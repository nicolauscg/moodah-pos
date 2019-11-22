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
        image
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
const GET_POS_PRODUCT_WITH_ID = gql`
  query {
    posProduct(input: { id: "cHJvZHVjdC50ZW1wbGF0ZTox" }) {
      id
      name
      canBeSold
      cost
      sales
      salesPrice
      barcode
    }
  }
`;

const CREATE_VALID_POS_PRODUCT = gql`
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
const CREATE_INVALID_POS_PRODUCT = gql`
  mutation {
    createPosProduct(input: { name: -1 }) {
      id
      posProduct {
        id
        name
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
const getDeletePosProductQuery = (id: string) => gql`
  mutation {
    deletePosProduct (input: {
      id: "${id}"
    }) {
      success
      posProduct {
        id
        name
      }
    }
  }`;

const GET_PRODUCT_CATEGORES = gql`
  query {
    categories {
      length
      records {
        id
        name
      }
    }
  }
`;

// Function that returns the posProduct query based on the id given
function getPosProductQuery(id: string) {
  return gql`
    query {
      posProduct(input: {
        id: "${id}"
      }) {
        id
        name
      }
    }
  `;
}

const filterPosProductQueryError = gql`
  query {
    posProducts(
      input: {
        where: {
          OR: [
            {
              name: "cannot place 2 keys inside object"
              name: "or else will cause error"
            }
          ]
        }
      }
    ) {
      records {
        id
        name
      }
    }
  }
`;

export default {
  SIGN_IN,
  GET_POS_PRODUCT,
  CREATE_VALID_POS_PRODUCT,
  CREATE_INVALID_POS_PRODUCT,
  GET_PRODUCT_CATEGORES,
  getUpdatePosProductQuery,
  getDeletePosProductQuery,
  GET_POS_PRODUCT_WITH_ID,
  getPosProductQuery,
  filterPosProductQueryError
};
