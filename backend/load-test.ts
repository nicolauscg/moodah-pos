/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const EasyGraphQLLoadTester = require("easygraphql-load-tester");

// eslint-disable-next-line no-sync
const familySchema = fs.readFileSync(
  path.join(__dirname, "src", "graphql", "schemas", "schema.gql"),
  "utf8"
);

const args = {
  posConfigs: {
    input: {}
  },
  paymentMethods: {
    input: {}
  }
};

const easyGraphQLLoadTester = new EasyGraphQLLoadTester(familySchema, args);

const testCases = easyGraphQLLoadTester.artillery({
  selectedQueries: ["posConfigs"],
  // selectedQueries: ["paymentMethods"],
  withMutations: false
});

module.exports = {
  testCases
};
