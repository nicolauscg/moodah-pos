import { createTestClient } from "apollo-server-testing";
import { toGlobalId } from "graphql-relay";
import { right } from "fp-ts/lib/Either";
import { decamelizeKeys } from "humps";
import xs from "xstream";
import * as nodoo from "nodoo";

import { createTestServer } from "../../utility/createTestServer";
import stubResponse, { posCategory } from "../stubResponse";
import posCategoryRequests from "../../integration/graphqls/posCategory";

const stubbedCreateService = jest.spyOn(nodoo, "createService");
beforeEach(() => {
  stubbedCreateService.mockReset();
});

describe("Stub category tests", () => {
  const completePosCategoryObject = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...(({ globalIdType, ...rest }) => rest)(posCategory),
    id: toGlobalId(posCategory.globalIdType, String(posCategory.id)),
    parent: {
      ...posCategory.parent,
      id: toGlobalId(posCategory.globalIdType, String(posCategory.parent.id))
    }
  };
  const simplePosCategoryObject = (({ id, name }) => ({
    id,
    name
  }))(completePosCategoryObject);

  describe("query tests", () => {
    it("test query all return correct value", async () => {
      stubbedCreateService
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.queryAll)))
        )
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.nestedQueryParent)))
        );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
      })).data.posCategories;

      expect(result.length).toEqual(stubResponse.queryAll.records.length);
      expect(result.records).toContainEqual(completePosCategoryObject);
    });

    it("test query read return correct value", async () => {
      stubbedCreateService
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.queryRead)))
        )
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.nestedQueryParent)))
        );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posCategoryRequests.GET_READ_POS_CATEGORY
      })).data.posCategory;

      expect(result).toEqual(completePosCategoryObject);
    });
  });

  describe("Stub test mutation", () => {
    it("test mutation create return correct value", async () => {
      stubbedCreateService
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.mutationCreate)))
        )
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.queryRead)))
        );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posCategoryRequests.CREATE_POS_CATEGORY
      })).data.createPosCategory;

      expect(result).toMatchObject({
        id: simplePosCategoryObject.id,
        posCategory: simplePosCategoryObject
      });
    });

    it("test mutation update return correct value", async () => {
      stubbedCreateService
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.mutationUpdate)))
        )
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.queryRead)))
        );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posCategoryRequests.getUpdatePosCategoryQuery(`{
          id: "cG9zLmNhdGVnb3J5OjM="
        }`)
      })).data.updatePosCategory;

      expect(result).toMatchObject({
        success: true,
        posCategory: simplePosCategoryObject
      });
    });

    it("test mutation delete return correct value", async () => {
      stubbedCreateService
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.queryRead)))
        )
        .mockReturnValueOnce(
          xs.of(right(decamelizeKeys(stubResponse.mutationDelete)))
        );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posCategoryRequests.getDeletePosCategoryQuery(
          "cG9zLmNhdGVnb3J5OjM="
        )
      })).data.deletePosCategory;

      expect(result).toMatchObject({
        success: true,
        posCategory: simplePosCategoryObject
      });
    });
  });
});
