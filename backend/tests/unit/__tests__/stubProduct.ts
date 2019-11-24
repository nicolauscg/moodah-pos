import { createTestClient } from "apollo-server-testing";
import { right } from "fp-ts/lib/Either";
import { decamelizeKeys } from "humps";
import xs from "xstream";
import * as nodoo from "nodoo";

import { createTestServer } from "../../utility/createTestServer";
import stubResponse, { posProduct } from "../stubResponse";
import posProductRequests from "../../integration/graphqls/posProduct";

const stubbedCreateService = jest.spyOn(nodoo, "createService");
beforeEach(() => {
  stubbedCreateService.mockReset();
});

describe("Product stub tests", () => {
  const simplePosProductObject = (({ id, name }) => ({
    id,
    name
  }))(posProduct);

  describe("query", () => {
    it("test query all return correct value", async () => {
      stubbedCreateService.mockReturnValueOnce(
        xs.of(right(decamelizeKeys(stubResponse.queryAllPosProduct)))
      );

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posProductRequests.GET_POS_PRODUCT_STUB
      })).data.posProducts;

      expect(result.length).toEqual(
        stubResponse.queryAllPosProduct.records.length
      );
      expect(result.records).toContainEqual(posProduct);
    });
  });

//   it("test query read return correct value", async () => {
//     stubbedCreateService.mockReturnValueOnce(
//       xs.of(right(decamelizeKeys(stubResponse.queryReadPosProduct)))
//     );

//     const server = createTestServer();
//     const { query } = createTestClient(server);
//     const result = (await query({
//       query: posProductRequests.GET_READ_POS_PRODUCT_STUB
//     })).data.posProduct;

//     expect(result).toEqual(posProduct);
//   });
});
