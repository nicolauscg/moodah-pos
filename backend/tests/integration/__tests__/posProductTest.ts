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

const CREATE_POS_CATEGORY = gql`
  mutation {
    createPosCategory(input: { name: "createdFromTest" }) {
      id
      posCategory {
        id
        name
      }
    }
  }
`;
describe("Mutation", () => {
  // Needs to be changed with the
  it("create pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const createResult = (await query({ query: CREATE_POS_CATEGORY })).data
      .createPosCategory;
    expect(createResult.id).not.toBeNull();
  });
});
