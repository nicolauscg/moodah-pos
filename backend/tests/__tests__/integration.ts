import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createTestServer, createTestServerWithSessionToken } from "../utils";
import { fromGlobalId } from "graphql-relay";

// graphql payloads for testing
const GET_TEST = gql`
  {
    test
  }
`;
const GET_POS_CONFIGS = gql`
  query {
    posConfigs {
      id
      name
      active
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
const CREATE_WITH_CORRECT_INPUT = gql`
  mutation {
    createPosConfig(input: { name: "createdFromTest", pickingTypeId: 12 }) {
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
const getPaymentMethod = gql`
  query {
    paymentMethods {
      name
      id
    }
  }
`;

describe("Query", () => {
  it("return test query response", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: GET_TEST });
    expect(res.data.test).toEqual("test");
  });

  it("fetch pos configs without session token", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS });
    expect(res.data.posConfigs).toBeNull();
  });

  // test that still return the config location id
  it("return test query response for nested query location", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS_LOCATION });
    for (const index of res.data.posConfigs) {
      expect(index.stockLocationId).not.toBeNull();
    }
  });

  it("fetch pos configs with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS });
    expect(res.data.posConfigs).not.toBeNull();
  });

  it("fetch singular pos config with session token via wrong id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    // Id is set as natural number, -1 will always be wrong id
    const WRONG_ID = -1;
    const { query } = createTestClient(server);
    const GET_POS_CONFIG = getPosConfigQuery(WRONG_ID);
    const res = await query({ query: GET_POS_CONFIG });
    expect(res.data.posConfig).toBeNull();
  });

  it(`fetch singular pos config with session token via id from multiple 
      pos configs fetch`, async () => {
    const amountOfIdsToRead = 3;
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    // posConfigRes will contain the id that will be used to check
    // if the singular posConfig is working
    const posConfigRes = await query({ query: GET_POS_CONFIGS });
    const idsToRead = posConfigRes.data.posConfigs
      .slice(0, amountOfIdsToRead)
      .map(posConfig => parseInt(fromGlobalId(posConfig.id).id, 10));
    // concurrently read posConfig
    Promise.all(
      idsToRead.map(id => query({ query: getPosConfigQuery(id) }))
    ).then(posConfigResults =>
      posConfigResults.forEach(
        (posConfigResult: any) =>
          expect(posConfigResult.data.posConfig).not.toBeNull() &&
          expect(posConfigResult.data.posConfig.name).not.toBeNull() &&
          expect(posConfigResult.data.posConfig.stockLocation).not.toBeNull()
      )
    );
  });

  // test that returns the payment method
  it("get payment method", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: getPaymentMethod });
    expect(res.data.paymentMethods).not.toBeNull();
  });
});

describe("Mutations", () => {
  it("correct credentials returns session token", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN
    });
    expect(res.data.signIn.sessionToken).toEqual(expect.any(String));
  });

  it("incorrect credentials returns null", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN_WITH_WRONG_CREDENTIALS
    });
    expect(res.data.signIn).toBeNull();
  });

  it("correct create returns correct output then delete", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const createResult: any = await mutate({
      mutation: CREATE_WITH_CORRECT_INPUT
    });
    const deleteResult: any = await mutate({
      mutation: getDeletePosConfigQuery(createResult.data.createPosConfig.id)
    });
    expect(createResult.data.createPosConfig.id).not.toBeNull();
    expect(deleteResult.data.deletePosConfig.success).toEqual(true);
  });

  it("create pos cofig, update, then delete", async () => {
    const UPDATED_POS_CONFIG_NAME = "updatedFromTest";
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const createResult: any = await mutate({
      mutation: CREATE_WITH_CORRECT_INPUT
    });
    const createdPosConfigId = createResult.data.createPosConfig.id;
    const updateResult: any = await mutate({
      mutation: getUpdatePostConfigQuery(`{
        id: ${createdPosConfigId},
        name: "${UPDATED_POS_CONFIG_NAME}"
      }`)
    });
    const deleteResult: any = await mutate({
      mutation: getDeletePosConfigQuery(createdPosConfigId)
    });
    expect(createResult.data.createPosConfig).not.toBeNull();
    expect(updateResult.data.updatePosConfig.posConfig.name).toEqual(
      UPDATED_POS_CONFIG_NAME
    );
    expect(deleteResult.data.deletePosConfig.success).toEqual(true);
  });
});
