import { createTestClient } from "apollo-server-testing";

import { createTestServerWithSessionToken } from "../../utility/createTestServer";
import posSessionRequests from "../graphqls/posSession";

describe("Query", () => {
  it("query fetch all pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posSessionRequests.GET_POS_SESSION
    });
    expect(res.data.posSession.length).not.toBeNull();
    expect(res.data.posSession.records).not.toBeNull();
  });
});
