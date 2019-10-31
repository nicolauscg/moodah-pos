import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createTestServerWithSessionToken } from "../../utils";

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
const GET_POS_PRODUCT = gql`
  query {
    posProducts {
      length
      records {
        id
        name
        type
        category
      }
    }
  }
`;

describe("Query", () => {
  it("query fetch all pos product", async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_PRODUCT });
    expect(res.data.posProducts).not.toBeNull();
  });
});
