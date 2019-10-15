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
});
