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

const CREATE_POS_PRODUCT = gql`
  mutation {
    createPosProduct(input: { name: "createdFromTest" }) {
      id
      posProduct {
        id
        name
        canBeSold
        canBePurchased
        productType
        category {
          id
          name
        }
        internalReference
        barcode
        HSCode
        salesPrice
        cost
        sales
        purchases
        archive
        onHand
        forecastedQuantity
        reorderingRules
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
    const createResult = (await query({ query: CREATE_POS_PRODUCT })).data
      .createPosProduct;
    expect(createResult.id).not.toBeNull();
  });
});
