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

  it("update pos product without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.getUpdatePosProductQuery(`{
          id: -1,
          name: "new name"
        }`)
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("delete pos product without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posProductRequests.getDeletePosProductQuery(-1)
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
      query: posProductRequests.CREATE_POS_PRODUCT
    })).data.createPosProduct;
    expect(createResult.id).not.toBeNull();

    const { mutate } = createTestClient(server);
    const createdPosProductId = createResult.id;
    const updateResult: any = await mutate({
      mutation: posProductRequests.getUpdatePosProductQuery(`{
        id: ${createdPosProductId},
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
