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
});
