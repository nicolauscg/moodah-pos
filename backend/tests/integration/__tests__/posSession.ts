import {
  createTestServer,
  createTestServerWithSessionToken
} from "../../utility/createTestServer";
import { createTestClient } from "apollo-server-testing";

import posSessionRequests from "../graphqls/posSession";

describe("Query", () => {
  it("fetch pos session without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({
      query: posSessionRequests.getPosSessionQuery("cG9zLnNlc3Npb246MQ==")
    });
    expect(res.errors).toEqual(expect.anything());
  });

  it("fetch singular pos sesison with session token via wrong id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    // Id is set as natural number, -1 will always be wrong id
    const WRONG_ID = "-1";
    const { query } = createTestClient(server);
    const GET_POS_SESSION = posSessionRequests.getPosSessionQuery(WRONG_ID);
    const res = await query({ query: GET_POS_SESSION });
    expect(res.errors).toEqual(expect.anything());
  });

  it("fetch singular pos sesison with session token via correct id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posSessionRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const GET_POS_SESSION = posSessionRequests.getPosSessionQuery(
      "cG9zLnNlc3Npb246MQ=="
    );
    const res = await query({ query: GET_POS_SESSION });
    // eslint-disable-next-line no-unused-expressions
    expect(res.data.resUser).not.toBeNull() &&
      expect(res.data.resUser.company).not.toBeNull() &&
      expect(res.data.resUser.company.id).not.toBeNull() &&
      expect(res.data.resUser.company.name).not.toBeNull();
  });
});
