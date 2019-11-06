import { createTestClient } from "apollo-server-testing";

import {
  createTestServer,
  createTestServerWithSessionToken
} from "../../utility/createTestServer";
import posConfigRequests from "../graphqls/posConfig";

describe("Query", () => {
  it("fetch pos configs without session token", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: posConfigRequests.GET_POS_CONFIGS });
    expect(res.data.posConfigs).toBeNull();
  });

  // test that still return the config location id
  it("return test query response for nested query location", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posConfigRequests.GET_POS_CONFIGS_LOCATION
    });
    for (const index of res.data.posConfigs.records) {
      expect(index.stockLocationId).not.toBeNull();
    }
  });

  it("fetch pos config without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({
      query: posConfigRequests.getPosConfigQuery("cG9zLmNvbmZpZzox")
    });
    expect(res.errors).toEqual(expect.anything());
  });

  it("fetch pos configs with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posConfigRequests.GET_POS_CONFIGS_ALL_FIELDS
    });
    expect(res.data.posConfigs).not.toBeNull();
  });

  it("fetch singular pos config with session token via wrong id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    // Id is set as natural number, -1 will always be wrong id
    const WRONG_ID = "-1";
    const { query } = createTestClient(server);
    const GET_POS_CONFIG = posConfigRequests.getPosConfigQuery(WRONG_ID);
    const res = await query({ query: GET_POS_CONFIG });
    expect(res.errors).toEqual(expect.anything());
  });

  it("query availablePriceLists with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({
      query: posConfigRequests.GET_AVAILABLE_PRICELIST
    })).data.availablePriceLists;
    expect(result.length).toEqual(expect.anything());
    expect(result.records).toEqual(expect.anything());
    expect(result.records).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        currency: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      })
    );
  });

  it("query availablePriceLists without session token", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = await query({
      query: posConfigRequests.GET_AVAILABLE_PRICELIST
    });
    expect(result.data.availablePriceLists).toBeNull();
    expect(result.errors).toEqual(expect.anything());
  });

  it(`fetch singular pos config with session token via id from multiple 
      pos configs fetch`, async () => {
    const amountOfIdsToRead = 3;
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // posConfigRes will contain the id that will be used to check
    // if the singular posConfig is working
    const posConfigRes = await query({
      query: posConfigRequests.GET_POS_CONFIGS
    });
    const idsToRead = posConfigRes.data.posConfigs.records
      .slice(0, amountOfIdsToRead)
      .map(posConfig => posConfig.id);
    // concurrently read posConfig
    Promise.all(
      idsToRead.map(id =>
        query({ query: posConfigRequests.getPosConfigQuery(id) })
      )
    ).then(posConfigResults =>
      posConfigResults.forEach(
        (posConfigResult: any) =>
          expect(posConfigResult.data.posConfig).not.toBeNull() &&
          expect(posConfigResult.data.posConfig.name).not.toBeNull() &&
          expect(posConfigResult.data.posConfig.stockLocation).not.toBeNull()
      )
    );
  });

  it("query paymentMethods with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({
      query: posConfigRequests.GET_OPERATION_TYPES
    })).data.paymentMethods;
    expect(result.length).toEqual(expect.any(Number));
    expect(result.records).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        company: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      })
    );
  });

  it("query paymentMethods without session token", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = await query({
      query: posConfigRequests.GET_OPERATION_TYPES
    });
    expect(result.data.paymentMethods).toBeNull();
    expect(result.errors).toEqual(expect.anything());
  });

  it("fetch all inventory operation types", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: posConfigRequests.GET_INVENTORY_TYPES });
    expect(res.data.operationTypes).not.toBeNull();
  });

  it("fetch all inventory stock locations", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: posConfigRequests.GET_STOCK_LOCATIONS });
    expect(res.data.stockLocations).not.toBeNull();
  });

  it("fetch discount products", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({
      query: posConfigRequests.GET_DISCOUNT_PRODUCTS
    })).data.discountProducts;
    expect(result).not.toBeNull();
    if (result.records.length) {
      expect(result.records[0].id).toEqual(expect.any(String));
      expect(result.records[0].name).toEqual(expect.any(String));
    }
  });

  it("fetch paginated pos configs returns correct record length", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const AMOUNT_TO_FETCH = 5;
    const { query } = createTestClient(server);
    const result = (await query({
      query: posConfigRequests.getPaginatedPosConfigQuery(AMOUNT_TO_FETCH)
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
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const GET_ONE_RECORD = 1;
    const OFFSETS_TO_TEST = 3;
    const { length, records } = (await query({
      query: posConfigRequests.getPaginatedPosConfigQuery(OFFSETS_TO_TEST)
    })).data.posConfigs;
    const recordIds = records.map(record => record.id);
    Promise.all(
      [...Array(Math.min(OFFSETS_TO_TEST, length)).keys()].map(offset =>
        query({
          query: posConfigRequests.getPaginatedPosConfigQuery(
            GET_ONE_RECORD,
            offset
          )
        })
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
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const posConfigResults = await query({
      query: posConfigRequests.GET_POS_CONFIGS
    });
    const unfilteredData = posConfigResults.data.posConfigs.records;
    // The database should have at least one posConfigs data for the test to work
    expect(unfilteredData[0]).toBeDefined();

    const name = unfilteredData[0].name;
    const stockLocationName = unfilteredData[0].stockLocation.name;
    const filteredQuery = posConfigRequests.filterPosConfigQuery(
      name,
      stockLocationName
    );
    // Testing the created graphQL filter function
    const filteredResult1 = await query({ query: filteredQuery });
    // Manual javascript filter function
    const filteredResult2 = unfilteredData.filter(
      (data: { name: any; stockLocation: { name: any } }) =>
        data.name === unfilteredData[0].name &&
        data.stockLocation.name === unfilteredData[0].stockLocation.name
    );

    // Checks whether the graphQL filter function actually "filters" the data
    expect(filteredResult1.data.posConfigs.records).toEqual(
      expect.arrayContaining(filteredResult2)
    );
  });

  it("fetch filtered pos without proper convention", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // Testing the created graphQL filter function
    const result = await query({
      query: posConfigRequests.filterPosConfigQueryError
    });
    // Manual javascript filter function
    expect(result.errors).toEqual(expect.anything());
  });

  // fetch created graphQL posConfig by comparing it with the normal javascript ANDfilter function
  it("fetch filtered pos config using AND", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const posConfigResults = await query({
      query: posConfigRequests.getPaginatedPosConfigQuery()
    });
    const unfilteredData = posConfigResults.data.posConfigs.records;

    // The database should have at least one posConfigs data for the test to work
    const name = unfilteredData[0].name;
    const stockLocationName = unfilteredData[0].stockLocation.name;

    const filteredQuery = posConfigRequests.filterPosConfigQueryExclusiveAndOr(
      "AND",
      name,
      stockLocationName
    );
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

  // fetch created graphQL posConfig by comparing it with the normal javascript OR filter function
  it("fetch filtered pos config using OR", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const posConfigResults = await query({
      query: posConfigRequests.getPaginatedPosConfigQuery()
    });
    const unfilteredData = posConfigResults.data.posConfigs.records;

    // The database should have at least one posConfigs data for the test to work
    const name = unfilteredData[0].name;
    const stockLocationName = unfilteredData[0].stockLocation.name;

    const filteredQuery = posConfigRequests.filterPosConfigQueryExclusiveAndOr(
      "OR",
      name,
      stockLocationName
    );
    // Testing the created graphQL filter function
    const filteredResult1 = await query({ query: filteredQuery });
    // Manual javascript filter function
    const filteredResult2 = unfilteredData.filter(
      (data: { name: any; stockLocation: { name: any } }) =>
        data.name === unfilteredData[0].name ||
        data.stockLocation.name === unfilteredData[0].stockLocation.name
    );

    // Checks whether the graphQL filter function actually "filters" the data
    expect(filteredResult1.data.posConfigs.records).toStrictEqual(
      filteredResult2
    );
  });

  it("fetch filtered pos config using ANDOR", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const results = await query({
      query: posConfigRequests.filterPosConfigQueryBothAndOr
    });
    expect(results.data.posConfigs.records).not.toBeNull();
  });
});

describe("Mutations", () => {
  it("correct credentials returns session token", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: posConfigRequests.SIGN_IN
    });
    expect(res.data.signIn.sessionToken).toEqual(expect.any(String));
  });

  it("incorrect credentials returns null", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: posConfigRequests.SIGN_IN_WITH_WRONG_CREDENTIALS
    });
    expect(res.data.signIn).toBeNull();
  });

  it("invalid database on sign in give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: posConfigRequests.SIGN_IN_WITH_INVALID_DB
    });
    expect(res.errors).toEqual(expect.anything());
  });

  it("correct create returns correct output then delete", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const createResult: any = await mutate({
      mutation: posConfigRequests.CREATE_WITH_CORRECT_INPUT
    });
    const deleteResult: any = await mutate({
      mutation: posConfigRequests.getDeletePosConfigQuery(
        createResult.data.createPosConfig.id
      )
    });
    expect(createResult.data.createPosConfig.id).not.toBeNull();
    expect(deleteResult.data.deletePosConfig.success).toEqual(true);
  });

  it("create pos cofig, update, then delete", async () => {
    const UPDATED_POS_CONFIG_NAME = "updatedFromTest";
    const server = await createTestServerWithSessionToken({
      signInGql: posConfigRequests.SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const createResult: any = await mutate({
      mutation: posConfigRequests.CREATE_WITH_CORRECT_INPUT
    });
    const createdPosConfigId = createResult.data.createPosConfig.id;
    const updateResult: any = await mutate({
      mutation: posConfigRequests.getUpdatePostConfigQuery(`{
        id: "${createdPosConfigId}",
        name: "${UPDATED_POS_CONFIG_NAME}",
        journalIds : ["YWNjb3VudC5qb3VybmFsOjEx"]
      }`)
    });
    const deleteResult: any = await mutate({
      mutation: posConfigRequests.getDeletePosConfigQuery(createdPosConfigId)
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
      mutation: posConfigRequests.CREATE_WITH_CORRECT_INPUT
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("update pos cofig without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posConfigRequests.getUpdatePostConfigQuery(`{
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
      mutation: posConfigRequests.getDeletePosConfigQuery("-1")
    });
    expect(result.errors).toEqual(expect.anything());
  });
});
