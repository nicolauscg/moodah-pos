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
        image
        parent {
          id
          name
        }
        sequence
      }
    }
  }
`;
const CREATE_POS_CATEGORY = gql`
  mutation {
    createPosCategory(
      input: { name: "createdFromTest", parentId: 3, sequence: 0 }
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
const getUpdatePostCategoryQuery = (fieldsToUpate: string) => gql`
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
const getDeletePosCategoryQuery = (id: number) => gql`
  mutation {
    deletePosCategory(input: {
      id: ${id}
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
    posCategory(input: { id: 1 }) {
      id
      name
    }
  }
`;

export default {
  SIGN_IN,
  GET_POS_CATEGORIES_WITH_ALL_FIELDS,
  CREATE_POS_CATEGORY,
  getUpdatePostCategoryQuery,
  getDeletePosCategoryQuery,
  GET_READ_POS_CATEGORY
};
