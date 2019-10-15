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
const getPaginatedPosConfigQuery = (first = 0, offset = 0) => gql`
  query {
    posConfigs(input: { first: ${first}, offset: ${offset} }) {
      length
      records {
        id
        name
        active
      }
    }
  }
`;

// Function that returns the filtered pos config query based on args given
function filterPosConfigQuery(name: string, stockLocationName: string) {
  return gql`
    query {
      posConfigs(where: {
        name:"${name}",
        stockLocationName:"${stockLocationName}"
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
      input: { name: "createdFromTest", pickingTypeId: 12, journalIds: [36] }
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
    for (const index of res.data.posConfigs.records) {
      expect(index.stockLocationId).not.toBeNull();
    }
  });

  it("fetch pos config without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: getPosConfigQuery(1) });
    expect(res.errors).toEqual(expect.anything());
  });

  it("fetch pos configs with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS_ALL_FIELDS });
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
    const idsToRead = posConfigRes.data.posConfigs.records
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

  it("fetch paginated pos configs returns correct record length", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const AMOUNT_TO_FETCH = 5;
    const { query } = createTestClient(server);
    const result = (await query({
      query: getPaginatedPosConfigQuery(AMOUNT_TO_FETCH)
    })).data.posConfigs;
    expect(result.length).not.toBeNull();
    if (result.length >= AMOUNT_TO_FETCH) {
      expect(result.records.length).toEqual(AMOUNT_TO_FETCH);
    } else {
      expect(result.records.length).toEqual(result.length);
    }
  });

  it("fetch paginated pos configs check offset", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const GET_ONE_RECORD = 1;
    const OFFSETS_TO_TEST = 3;
    const { length, records } = (await query({
      query: getPaginatedPosConfigQuery(OFFSETS_TO_TEST)
    })).data.posConfigs;
    const recordIds = records.map(record => record.id);
    Promise.all(
      [...Array(Math.min(OFFSETS_TO_TEST, length)).keys()].map(offset =>
        query({ query: getPaginatedPosConfigQuery(GET_ONE_RECORD, offset) })
      )
    ).then(paginatedResults =>
      paginatedResults.forEach((paginatedResult: any, index: number) =>
        expect(paginatedResult.data.posConfigs.records[0].id).toEqual(
          recordIds[index]
        )
      )
    );
  });

  // fetch created graphQL posConfig by comparing it with the normal javascript filter function
  it("fetch filtered pos config", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const posConfigResults = await query({ query: GET_POS_CONFIGS });
    const unfilteredData = posConfigResults.data.posConfigs.records;
    // The database should have at least one posConfigs data for the test to work
    expect(unfilteredData[0]).toBeDefined();

    const name = unfilteredData[0].name;
    const stockLocationName = unfilteredData[0].stockLocation.name;
    const filteredQuery = filterPosConfigQuery(name, stockLocationName);

    // Testing the created graphQL filter function
    const filteredResult1 = await query({ query: filteredQuery });
    // Manual javascript filter function
    const filteredResult2 = unfilteredData.filter(
      (data: { name: any; stockLocation: { name: any } }) =>
        data.name === unfilteredData[0].name &&
        data.stockLocation.name === unfilteredData[0].stockLocation.name
    );

    // Checks whether the graphQL filter function actually "filters" the data
    expect(filteredResult1.data.posConfigs.records).toStrictEqual(
      filteredResult2
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

  it("invalid database on sign in give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN_WITH_INVALID_DB
    });
    expect(res.errors).toEqual(expect.anything());
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
        name: "${UPDATED_POS_CONFIG_NAME}",
        journalIds : [36]
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

  it("create pos cofig without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: CREATE_WITH_CORRECT_INPUT
    });

    expect(result.errors).toEqual(expect.anything());
  });

  it("update pos cofig without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: getUpdatePostConfigQuery(`{
          id: -1,
          name: "new name"
        }`)
    });

    expect(result.errors).toEqual(expect.anything());
  });

  it("delete pos cofig without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: getDeletePosConfigQuery(-1)
    });

    expect(result.errors).toEqual(expect.anything());
  });
});
