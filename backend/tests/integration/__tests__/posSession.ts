import { createTestClient } from "apollo-server-testing";

import {
  createTestServerWithSessionToken,
  createTestServer
} from "../../utility/createTestServer";
import posSessionRequests from "../graphqls/posSession";

describe("Mutation", () => {
  it("open session without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posSessionRequests.OPEN_SESSION("")
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("close session without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posSessionRequests.CLOSE_SESSION("")
    });
    expect(result.errors).toEqual(expect.anything());
  });

  it("open then close session", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { mutate } = createTestClient(server);
    const openSessionResult: any = (await mutate({
      mutation: posSessionRequests.OPEN_SESSION("cG9zLmNvbmZpZzo1")
    })).data.openSession;
    const sessionId = openSessionResult.sessionId;
    expect(sessionId).toEqual(expect.any(String));

    const closeSessionResult: any = (await mutate({
      mutation: posSessionRequests.CLOSE_SESSION(sessionId)
    })).data.closeSession;
    expect(closeSessionResult.success).toEqual(true);
  });
});
