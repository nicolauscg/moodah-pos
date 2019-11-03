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
      mutation: posCategoryRequests.getUpdatePostCategoryQuery(`{
        id: ${createdPosCategoryId},
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
      mutation: posCategoryRequests.getUpdatePostCategoryQuery(`{
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
      mutation: posCategoryRequests.getDeletePosCategoryQuery(-1)
    });

    expect(result.errors).toEqual(expect.anything());
  });
});
