import { createTestClient } from "apollo-server-testing";
import { right } from "fp-ts/lib/Either";
import { decamelizeKeys } from "humps";
import xs from "xstream";
import * as nodoo from "nodoo";

import { createTestServer } from "../../utility/createTestServer";
import mockResponse from "../mockResponse";
import posCategoryRequests from "../../integration/graphqls/posCategory";

const mockedCreateService = jest.spyOn(nodoo, "createService");
beforeEach(() => {
  mockedCreateService.mockReset();
});

describe("Query", () => {
  const completePosCategoryShape = {
    id: expect.any(String),
    name: expect.any(String),
    displayName: expect.any(String),
    image: expect.any(String),
    parent: expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      displayName: expect.any(String)
    }),
    sequence: expect.any(Number)
  };

  it("mock query all", async () => {
    mockedCreateService
      .mockReturnValueOnce(xs.of(right(decamelizeKeys(mockResponse.queryAll))))
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.nestedQueryParent)))
      );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    })).data.posCategories;

    expect(result.length).toEqual(expect.any(Number));
    expect(result.records).toContainEqual(
      expect.objectContaining(completePosCategoryShape)
    );
  });

  it("mock query read", async () => {
    mockedCreateService
      .mockReturnValueOnce(xs.of(right(decamelizeKeys(mockResponse.queryRead))))
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.nestedQueryParent)))
      );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.GET_READ_POS_CATEGORY
    })).data.posCategory;

    expect(result).toEqual(expect.objectContaining(completePosCategoryShape));
  });
});

describe("Mutation", () => {
  const simplePosCategoryShape = {
    id: expect.any(String),
    name: expect.any(String)
  };

  it("mock mutation create", async () => {
    mockedCreateService
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.mutationCreate)))
      )
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.queryRead)))
      );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.CREATE_POS_CATEGORY
    })).data.createPosCategory;

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        posCategory: expect.objectContaining(simplePosCategoryShape)
      })
    );
  });

  it("mock mutation update", async () => {
    mockedCreateService
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.mutationUpdate)))
      )
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.queryRead)))
      );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.getUpdatePosCategoryQuery(`{
        id: "cG9zLmNhdGVnb3J5OjM="
      }`)
    })).data.updatePosCategory;

    expect(result).toEqual(
      expect.objectContaining({
        success: expect.any(Boolean),
        posCategory: expect.objectContaining(simplePosCategoryShape)
      })
    );
  });

  it("mock mutation delete", async () => {
    mockedCreateService
      .mockReturnValueOnce(xs.of(right(decamelizeKeys(mockResponse.queryRead))))
      .mockReturnValueOnce(
        xs.of(right(decamelizeKeys(mockResponse.mutationDelete)))
      );

    const server = createTestServer();
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.getDeletePosCategoryQuery(
        "cG9zLmNhdGVnb3J5OjM="
      )
    })).data.deletePosCategory;

    expect(result).toEqual(
      expect.objectContaining({
        success: expect.any(Boolean),
        posCategory: expect.objectContaining(simplePosCategoryShape)
      })
    );
  });
});
