import { createTestClient } from "apollo-server-testing";
import { right } from "fp-ts/lib/Either";
import { decamelizeKeys } from "humps";
import xs, { Stream } from "xstream";
import * as packageNodoo from "nodoo";
import * as customNodoo from "../../../src/graphql/schemas/utility/nodoo";

import { createTestServer } from "../../utility/createTestServer";
import stubResponse from "../stubResponse";
import posProductRequests from "../../integration/graphqls/posProduct";

describe("Mock category tests", () => {
  describe("query tests", () => {
    it("test query all createService and configureService behavior", async () => {
      (packageNodoo as any).createService = jest
        .fn()
        .mockImplementationOnce(() =>
          xs.of(right(decamelizeKeys(stubResponse.queryAllPosProduct)))
        );

      (customNodoo as any).configureService = jest
        .fn()
        .mockImplementation(({ operation, onResult, onError }) => {
          const clientOptions = packageNodoo.createSecureClientOptions({
            host: "odoo.staging.moodah.id"
          });

          packageNodoo
            .createService({
              operation,
              clientOptions
            })
            .addListener({
              next: result => {
                result.fold(onError, onResult);
              }
            });
        });

      const server = createTestServer();
      const { query } = createTestClient(server);
      const result = (await query({
        query: posProductRequests.GET_POS_PRODUCT_STUB
      })).data.posProducts;

      expect(packageNodoo.createService).toHaveBeenCalledTimes(1);
      expect(packageNodoo.createService).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          operation: expect.objectContaining({
            kind: "searchRead"
          }),
          clientOptions: expect.objectContaining({
            kind: "secure"
          })
        })
      );
      expect(packageNodoo.createService).toHaveReturnedWith(expect.any(Stream));

      expect(customNodoo.configureService).toHaveBeenCalledTimes(1);
      expect(customNodoo.configureService).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            kind: "searchRead"
          }),
          onResult: expect.any(Function),
          onError: expect.any(Function)
        })
      );
      expect(customNodoo.configureService).toHaveReturnedWith(undefined);

      expect(result).toEqual(expect.anything());
    });
  });
});
