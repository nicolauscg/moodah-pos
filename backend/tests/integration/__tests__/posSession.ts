import { createTestClient } from "apollo-server-testing";
import {
  createTestServerWithSessionToken,
  createTestServer
} from "../../utility/createTestServer";
import posSessionRequests from "../graphqls/posSession";

describe("Pos Session Query", () => {
  it("query resUser without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({
      query: posSessionRequests.getUserQuery("cG9zLnNlc3Npb246MQ==")
    });
    expect(res.errors).toEqual(expect.anything());
  });

  it("query resUser with session token via wrong id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    // Id is set as natural number, -1 will always be wrong id
    const WRONG_ID = "-1";
    const { query } = createTestClient(server);
    const GET_POS_SESSION = posSessionRequests.getUserQuery(WRONG_ID);
    const res = await query({ query: GET_POS_SESSION });
    expect(res.errors).toEqual(expect.anything());
  });

  it("query resUser with session token via correct id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const GET_POS_SESSION = posSessionRequests.getUserQuery(
      "cG9zLnNlc3Npb246MQ=="
    );
    const res = await query({ query: GET_POS_SESSION });
    expect(res.data.getUserInfo).not.toBeNull();
    if (res.data.getUserInfo.company) {
      expect(res.data.getUserInfo.company).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      );
    }
  });
});

describe("Pos Session Mutation", () => {
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
