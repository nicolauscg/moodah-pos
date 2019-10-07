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
function getPosConfigQuery(id) {
  return gql`
    query {
      posConfig(id:${id}) {
        name
        active
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

  it("fetch singular pos config with session token via id from multiple pos configs fetch", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    // posConfigRes will contain the id that will be used to check
    // if the singular posConfig is working
    const posConfigRes = await query({ query: GET_POS_CONFIGS });
    for (const index of posConfigRes.data.posConfigs) {
      const id = fromGlobalId(index.id).id;
      const GET_SINGULAR_POS_CONFIG = getPosConfigQuery(id);
      // eslint-disable-next-line no-await-in-loop
      const res = await query({ query: GET_SINGULAR_POS_CONFIG });
      expect(res.data.posConfig).not.toBeNull();
    }
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
