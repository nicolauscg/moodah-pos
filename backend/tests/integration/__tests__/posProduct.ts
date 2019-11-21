import { createTestClient } from "apollo-server-testing";

import {
  createTestServerWithSessionToken,
  createTestServer
} from "../../utility/createTestServer";
import posProductRequests from "../graphqls/posProduct";

describe("Query", () => {
  it("query fetch all pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posProductRequests.GET_POS_PRODUCT
    });
    expect(res.data.posProducts.length).not.toBeNull();
    expect(res.data.posProducts.records).not.toBeNull();
  });

  it("query fetch pos product with specific id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posProductRequests.GET_POS_PRODUCT_WITH_ID
    });
    expect(res.data.posProduct).not.toBeNull();
  });

  it("query categories", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posProductRequests.GET_PRODUCT_CATEGORES
    });
    expect(res.data.categories.length).toEqual(expect.any(Number));
    expect(res.data.categories.records).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String)
      })
    );
  });

  it(`fetch singular pos product with session token via id from multiple 
  pos configs fetch`, async () => {
    const amountOfIdsToRead = 3;
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // posProductRes will contain the id that will be used to check
    // if the singular posConfig is working
    const posProductRes = await query({
      query: posProductRequests.GET_POS_PRODUCT
    });
    const idsToRead = posProductRes.data.posProducts.records
      .slice(0, amountOfIdsToRead)
      .map(posProduct => posProduct.id);
    // concurrently read posProductRes
    Promise.all(
      idsToRead.map(id =>
        query({ query: posProductRequests.getPosProductQuery(id) })
      )
    ).then(posProductResults =>
      posProductResults.forEach(
        (posProductResult: any) =>
          expect(posProductResult.data.posProduct).not.toBeNull() &&
          expect(posProductResult.data.posProduct.name).not.toBeNull()
      )
    );
  });

  it("fetch filtered pos without proper convention", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // Testing the created graphQL filter function
    const result = await query({
      query: posProductRequests.filterPosProductQueryError
    });
    // Manual javascript filter function
    expect(result.errors).toEqual(expect.anything());
  });
});

describe("Mutation", () => {
  it("create pos cofig without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.CREATE_VALID_POS_PRODUCT
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("create pos cofig without valid input give error", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.CREATE_INVALID_POS_PRODUCT
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("update pos product without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.getUpdatePosProductQuery(`{
          id: "-1",
          name: "new name"
        }`)
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("delete pos product without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.getDeletePosProductQuery("-1")
    });

    expect(result.errors).toEqual(expect.anything());
  });

  it("create pos product, update, then delete", async () => {
    const UPDATED_POS_PRODUCT_NAME = "updatedFromTest";
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const createResult = (await query({
      query: posProductRequests.CREATE_VALID_POS_PRODUCT
    })).data.createPosProduct;
    expect(createResult.id).not.toBeNull();

    const { mutate } = createTestClient(server);
    const createdPosProductId = createResult.id;
    const updateResult: any = await mutate({
      mutation: posProductRequests.getUpdatePosProductQuery(`{
        id: "${createdPosProductId}",
        name: "${UPDATED_POS_PRODUCT_NAME}"
      }`)
    });
    expect(updateResult.data.updatePosProduct.posProduct.name).toEqual(
      UPDATED_POS_PRODUCT_NAME
    );
    const deleteResult: any = await mutate({
      mutation: posProductRequests.getDeletePosProductQuery(createdPosProductId)
    });
    expect(deleteResult.data.deletePosProduct.success).toEqual(true);
  });
});
