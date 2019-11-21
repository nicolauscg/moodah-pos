import { createTestClient } from "apollo-server-testing";

import {
  createTestServer,
  createTestServerWithSessionToken
} from "../../utility/createTestServer";
import posCategoryRequests from "../graphqls/posCategory";

describe("Query", () => {
  it("query pos categories without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const { errors } = await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    });
    expect(errors).toEqual(expect.anything());
  });

  it("query pos categories with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posCategoryRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    })).data.posCategories;
    expect(result.length).not.toBeNull();
    expect(result.records).not.toBeNull();
  });

  it("fetch specific pos category when given id", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posCategoryRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: posCategoryRequests.GET_READ_POS_CATEGORY
    });
    expect(res.data.readPosCategories).not.toBeNull();
  });

  it(`fetch singular pos category with session token via id from multiple 
  pos categories fetch`, async () => {
    const amountOfIdsToRead = 3;
    const server = await createTestServerWithSessionToken({
      signInGql: posCategoryRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // posCategoryRes will contain the id that will be used to check
    // if the singular posCategory is working
    const posCategoryRes = await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    });
    const idsToRead = posCategoryRes.data.posCategories.records
      .slice(0, amountOfIdsToRead)
      .map(posCategory => posCategory.id);
    // concurrently read posCategory
    Promise.all(
      idsToRead.map(id =>
        query({ query: posCategoryRequests.getPosCategoryQuery(id) })
      )
    ).then(posCategoryResults =>
      posCategoryResults.forEach(
        (posCategoryResult: any) =>
          expect(posCategoryResult.data.posCategory).not.toBeNull() &&
          expect(posCategoryResult.data.posCategory.id).not.toBeNull() &&
          expect(posCategoryResult.data.posCategory.name).not.toBeNull()
      )
    );
  });

  it("fetch filtered pos without proper convention", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: posCategoryRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    // Testing the created graphQL filter function
    const result = await query({
      query: posCategoryRequests.filterPosCategoryQueryError
    });
    // Manual javascript filter function
    expect(result.errors).toEqual(expect.anything());
  });
});

describe("Mutation", () => {
  it("query pos categories with session token", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const { errors } = await query({
      query: posCategoryRequests.GET_POS_CATEGORIES_WITH_ALL_FIELDS
    });
    expect(errors).toEqual(expect.anything());
  });

  it("create pos category, update, then delete", async () => {
    const UPDATED_POS_CATEGORY_NAME = "updatedFromTest";
    const server = await createTestServerWithSessionToken({
      signInGql: posCategoryRequests.SIGN_IN
    });
    const { query } = createTestClient(server);
    const createResult = (await query({
      query: posCategoryRequests.CREATE_POS_CATEGORY
    })).data.createPosCategory;
    expect(createResult.id).not.toBeNull();
    const { mutate } = createTestClient(server);
    const createdPosCategoryId = createResult.id;
    const updateResult: any = await mutate({
      mutation: posCategoryRequests.getUpdatePosCategoryQuery(`{
        id: "${createdPosCategoryId}",
        name: "${UPDATED_POS_CATEGORY_NAME}"
      }`)
    });

    expect(updateResult.data.updatePosCategory.posCategory.name).toEqual(
      UPDATED_POS_CATEGORY_NAME
    );
    const deleteResult: any = await mutate({
      mutation: posCategoryRequests.getDeletePosCategoryQuery(
        createdPosCategoryId
      )
    });
    expect(deleteResult.data.deletePosCategory.success).toEqual(true);
  });

  it("update pos category without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posCategoryRequests.getUpdatePosCategoryQuery(`{
          id: -1,
          name: "new name"
        }`)
    });

    expect(result.errors).toEqual(expect.anything());
  });

  it("delete pos category without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: posCategoryRequests.getDeletePosCategoryQuery("-1")
    });

    expect(result.errors).toEqual(expect.anything());
  });
});
