import gql from "graphql-tag";

const GET_POS_CONFIGS = gql`
  query {
    posConfigs {
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;
const GET_POS_CONFIGS_ALL_FIELDS = gql`
  query {
    posConfigs {
      records {
        id
        name
        active
        pricelist {
          id
          name
        }
        discountProduct {
          id
          name
        }
        stockLocation {
          id
          name
        }
        pickingType {
          id
          name
        }
      }
    }
  }
`;

// Function that returns the filtered pos config query based on args given
function filterPosConfigQuery(name: string, stockLocationName: string) {
  return gql`
    query {
      posConfigs(input: {
        where: {
          OR: [
            {name:"${name}"},
            {stockLocationName:"${stockLocationName}"}
          ]
        }
      }) {
        records {
          id
          name
          active
          stockLocation {
            id
            name
          }
        }
      }
    }
  `;
}
const getPaginatedPosConfigQuery = (first = 0, offset = 0) => gql`
  query {
    posConfigs(input: { first: ${first}, offset: ${offset} }) {
      length
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;

const filterPosConfigQueryError = gql`
  query {
    posConfigs(
      input: {
        where: {
          OR: [
            { name: "cannot place 2 keys inside object", stockLocationName: "" }
          ]
        }
      }
    ) {
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;

const filterPosConfigQueryExclusiveAndOr = (andOr, name, stockLocationName) =>
  gql`
  query {
    posConfigs(input:{where:{ 
      ${andOr}:[{name:"${name}"},{stockLocationName:"${stockLocationName}"}]
    }}) {
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;

const filterPosConfigQueryBothAndOr = gql`
  query {
    posConfigs(
      input: {
        where: {
          AND: [
            { OR: [{ name: "test1" }, { stockLocationName: "WH" }] }
            { OR: [{ name: "test2" }] }
          ]
        }
      }
    ) {
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;

// Function that returns the posConfig query based on the id given
function getPosConfigQuery(id: number) {
  return gql`
    query {
      posConfig(input: {
        id:${id}
      }) {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  `;
}
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
const SIGN_IN_WITH_WRONG_CREDENTIALS = gql`
mutation {
  signIn(input: {
    db: "${process.env.odoo_db}",
    username: "test",
    password: "test"
  }) {
    sessionToken
  }
}
`;
const SIGN_IN_WITH_INVALID_DB = gql`
  mutation {
    signIn(input: { db: "", username: "", password: "" }) {
      sessionToken
    }
  }
`;
const CREATE_WITH_CORRECT_INPUT = gql`
  mutation {
    createPosConfig(
      input: { name: "createdFromTest", pickingTypeId: 2, journalIds: [11] }
    ) {
      posConfig {
        id
        name
        active
      }
      id
    }
  }
`;
const GET_POS_CONFIGS_LOCATION = gql`
  query {
    posConfigs {
      records {
        id
        name
        active
        stockLocation {
          id
          name
        }
      }
    }
  }
`;
const GET_INVENTORY_TYPES = gql`
  query {
    operationTypes(input: { first: 5, offset: 0 }) {
      length
      records {
        id
        name
      }
    }
  }
`;
const GET_STOCK_LOCATIONS = gql`
  query {
    stockLocations(input: { first: 5, offset: 0 }) {
      length
      records {
        id
        name
      }
    }
  }
`;
const getDeletePosConfigQuery = (id: number) => gql`
  mutation {
    deletePosConfig(input: {
      id: ${id}
    }) {
      success
      posConfig {
        id
        name
      }
    }
  }`;
const getUpdatePostConfigQuery = (fieldsToUpate: string) => gql`
  mutation {
    updatePosConfig(input: ${fieldsToUpate}) {
      success
      posConfig {
        id
        name
      }
    }
  }
`;
const GET_OPERATION_TYPES = gql`
  query {
    paymentMethods {
      length
      records {
        id
        name
        company {
          id
          name
        }
      }
    }
  }
`;
const GET_AVAILABLE_PRICELIST = gql`
  query {
    availablePriceLists {
      length
      records {
        id
        name
        currency {
          id
          name
        }
      }
    }
  }
`;

const GET_DISCOUNT_PRODUCTS = gql`
  query {
    discountProducts {
      length
      records {
        id
        name
      }
    }
  }
`;

export default {
  GET_POS_CONFIGS,
  GET_POS_CONFIGS_ALL_FIELDS,
  filterPosConfigQuery,
  getPaginatedPosConfigQuery,
  filterPosConfigQueryError,
  filterPosConfigQueryExclusiveAndOr,
  filterPosConfigQueryBothAndOr,
  getPosConfigQuery,
  SIGN_IN,
  SIGN_IN_WITH_WRONG_CREDENTIALS,
  SIGN_IN_WITH_INVALID_DB,
  CREATE_WITH_CORRECT_INPUT,
  GET_POS_CONFIGS_LOCATION,
  GET_INVENTORY_TYPES,
  GET_STOCK_LOCATIONS,
  getDeletePosConfigQuery,
  getUpdatePostConfigQuery,
  GET_OPERATION_TYPES,
  GET_AVAILABLE_PRICELIST,
  GET_DISCOUNT_PRODUCTS
};
