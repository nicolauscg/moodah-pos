import { createTestClient } from "apollo-server-testing";

import { createTestServerWithSessionToken } from "../../utility/createTestServer";
import posProductRequest from "../graphqls/posProduct";

describe("Query", () => {
  it("query fetch all pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posProductRequest.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posProductRequest.GET_POS_PRODUCT
    });
    expect(res.data.posProducts.length).not.toBeNull();
    expect(res.data.posProducts.records).not.toBeNull();
  });
});
