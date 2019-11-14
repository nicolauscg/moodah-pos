import { createTestClient } from "apollo-server-testing";
import { createTestServer } from "../../utility/createTestServer";
import posCategoryRequests from "../../integration/graphqls/posCategory";
import { right } from "fp-ts/lib/Either";
import * as nodoo from "nodoo";
import { decamelizeKeys } from "humps";
import xs from "xstream";

import mockResponse from "../mockResponse";

describe("Query", () => {
  it("mock query get all", async () => {
    const spy = jest.spyOn(nodoo, "createService");
    spy.mockReturnValueOnce(
      xs.of(right(decamelizeKeys(mockResponse.posCategories)))
    );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    })).data.posCategories;

    expect(result.length).toEqual(expect.any(Number));
    expect(result.records).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String)
      })
    );
  });
});
