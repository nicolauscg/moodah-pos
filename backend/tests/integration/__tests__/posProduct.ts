import { createTestClient } from "apollo-server-testing";

import {
  createTestServer,
  createTestServerWithSessionToken
} from "../../utility/createTestServer";
// import posCategoryRequests from "../graphqls/posCategory";
// import { createTestClient } from "apollo-server-testing";
// import { createTestServerWithSessionToken } from "../../utility/createTestServer";

import posProductRequests from "../graphqls/posProduct";

describe("Mutation", () => {
  // Needs to be changed with the
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
