import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import {
  createTestServer,
  createTestServerWithSessionToken
} from "../../utils";

const SIGN_IN = gql`
  mutation {
    signIn(input: {
      db: "${process.env.odoo_db}",
      username: "${process.env.odoo_username}",
      password: "${process.env.odoo_password}"
    }) {
      sessionToken
    }
  }
`;
const GET_POS_CATEGORIES_WITH_ALL_FIELDS = gql`
  query {
    posCategories {
      length
      records {
        id
        name
        image
        parent {
          id
          name
        }
        sequence
      }
    }
  }
`;
const CREATE_POS_CATEGORY = gql`
  mutation {
    createPosCategory(
      input: { name: "createdFromTest", parentId: 2, sequence: 0 }
    ) {
      id
      posCategory {
        id
        name
        parent {
          id
          name
        }
        image
        sequence
      }
    }
  }
`;
const getUpdatePostCategoryQuery = (fieldsToUpate: string) => gql`
  mutation {
    updatePosCategory(input: ${fieldsToUpate}) {
      success
      posCategory {
        id
        name
      }
    }
  }
`;
const getDeletePosCategoryQuery = (id: number) => gql`
mutation {
  deletePosCategory(input: {
    id: ${id}
  }) {
    success
    posCategory {
      id
      name
    }
  }
}`;

describe("Query", () => {
  it("query pos categories without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const { errors } = await query({
      query: GET_POS_CATEGORIES_WITH_ALL_FIELDS
    });
    expect(errors).toEqual(expect.anything());
  });

  it("query pos categories with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({ query: GET_POS_CATEGORIES_WITH_ALL_FIELDS }))
      .data.posCategories;
    expect(result.length).not.toBeNull();
    expect(result.records).not.toBeNull();
  });
});

describe("Mutation", () => {
  it("create pos category without session token give error", async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const { errors } = await query({
      query: GET_POS_CATEGORIES_WITH_ALL_FIELDS
    });
    expect(errors).toEqual(expect.anything());
  });

  it("query pos categories with session token", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const result = (await query({ query: CREATE_POS_CATEGORY })).data
      .createPosCategory;
    expect(result.id).not.toBeNull();
  });

  it("create pos category, update, then delete", async () => {
    const UPDATED_POS_CATEGORY_NAME = "updatedFromTest";
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const createResult = (await query({ query: CREATE_POS_CATEGORY })).data
      .createPosCategory;
    expect(createResult.id).not.toBeNull();

    const { mutate } = createTestClient(server);
    const createdPosCategoryId = createResult.id;
    const updateResult: any = await mutate({
      mutation: getUpdatePostCategoryQuery(`{
        id: ${createdPosCategoryId},
        name: "${UPDATED_POS_CATEGORY_NAME}"
      }`)
    });

    expect(updateResult.data.updatePosCategory.posCategory.name).toEqual(
      UPDATED_POS_CATEGORY_NAME
    );
    const deleteResult: any = await mutate({
      mutation: getDeletePosCategoryQuery(createdPosCategoryId)
    });
    expect(deleteResult.data.deletePosCategory.success).toEqual(true);
  });

  it("update pos category without session token give error", async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const result: any = await mutate({
      mutation: getUpdatePostCategoryQuery(`{
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
      mutation: getDeletePosCategoryQuery(-1)
    });

    expect(result.errors).toEqual(expect.anything());
  });
});
