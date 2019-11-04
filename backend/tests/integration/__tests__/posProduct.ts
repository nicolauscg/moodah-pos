import { createTestClient } from "apollo-server-testing";

import { createTestServerWithSessionToken } from "../../utility/createTestServer";
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
        id: expect.any(Number),
        name: expect.any(String)
      })
    );
  });
});

describe("Mutation", () => {
  // Needs to be followed with update, then delete
  it("create pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const createResult = (await query({
      query: posProductRequests.CREATE_POS_PRODUCT
    })).data.createPosProduct;
    expect(createResult.id).not.toBeNull();
  });
});
