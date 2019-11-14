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
const GET_POS_CATEGORIES_WITH_ALL_FIELDS = gql`
  query {
    posCategories {
      length
      records {
        id
        name
        displayName
        image
        parent {
          id
          name
          displayName
        }
        sequence
      }
    }
  }
`;
const CREATE_POS_CATEGORY = gql`
  mutation {
    createPosCategory(
      input: {
        name: "createdFromTest"
        parentId: "cG9zLmNhdGVnb3J5OjM="
        sequence: 0
      }
    ) {
      id
      posCategory {
        id
        name
        parent {
          id
          name
        }
        image
        sequence
      }
    }
  }
`;
const getUpdatePosCategoryQuery = (fieldsToUpate: string) => gql`
    mutation {
      updatePosCategory(input: ${fieldsToUpate}) {
        success
        posCategory {
          id
          name
        }
      }
    }
  `;
const getDeletePosCategoryQuery = (id: string) => gql`
  mutation {
    deletePosCategory(input: {
      id: "${id}"
    }) {
      success
      posCategory {
        id
        name
      }
    }
  }`;
const GET_READ_POS_CATEGORY = gql`
  query {
    posCategory(input: { id: "cG9zLmNhdGVnb3J5OjM=" }) {
      id
      name
      displayName
      image
      parent {
        id
        name
        displayName
      }
      sequence
    }
  }
`;

export default {
  SIGN_IN,
  GET_POS_CATEGORIES_WITH_ALL_FIELDS,
  CREATE_POS_CATEGORY,
  getUpdatePosCategoryQuery,
  getDeletePosCategoryQuery,
  GET_READ_POS_CATEGORY
};
