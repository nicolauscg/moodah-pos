import { createTestClient } from "apollo-server-testing";
import {
  createTestServerWithSessionToken,
  createTestServer
} from "../../utility/createTestServer";
import posSessionRequests from "../graphqls/posSession";

describe("Pos Session Query", () => {
  it("open session, fetch all pos product, then close it", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const { mutate } = createTestClient(server);
    const openSessionResult: any = await mutate({
      mutation: posSessionRequests.OPEN_SESSION("cG9zLmNvbmZpZzo1")
    });
    const id = openSessionResult.data.openSession.sessionId;
    expect(id).toEqual(expect.any(String));

    const res = await query({
      query: posSessionRequests.GET_POS_SESSION(id)
    });
    expect(res.data.posSession).not.toBeNull();

    const closeSessionResult: any = await mutate({
      mutation: posSessionRequests.CLOSE_SESSION(id)
    });
    expect(closeSessionResult.data.closeSession.success).toEqual(true);
  });

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

  it("open session, fetch all session, get account bank statement, then close it", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const { mutate } = createTestClient(server);
    const openSessionResult: any = await mutate({
      mutation: posSessionRequests.OPEN_SESSION("cG9zLmNvbmZpZzo1")
    });
    const id = openSessionResult.data.openSession.sessionId;
    expect(id).toEqual(expect.any(String));

    const res = await query({
      query: posSessionRequests.GET_ACCOUNT_BANK_STATEMENT(id)
    });
    expect(res.data.accountBankStatement).not.toBeNull();

    const closeSessionResult: any = await mutate({
      mutation: posSessionRequests.CLOSE_SESSION(id)
    });
    expect(closeSessionResult.data.closeSession.success).toEqual(true);
  });

  it("get wrong account bank statement", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const WRONG_ID = -1;
    const res = await query({
      query: posSessionRequests.GET_ACCOUNT_BANK_STATEMENT(WRONG_ID)
    });
    expect(res.errors).toEqual(expect.anything());
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
