import { ApolloServer } from "apollo-server-lambda";
import { createTestClient } from "apollo-server-testing";
import { schema } from "../src/graphql/schema";

const createTestServer = ({ context } = { context: () => {} }) =>
  new ApolloServer({
    schema,
    formatError: error => error,
    formatResponse: response => response,
    context
  });

const getSessionToken = async signInGql => {
  const server = createTestServer();
  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: signInGql
  });

  return res.data.signIn.sessionToken;
};

// create test server with context set with sessionToken
const createTestServerWithSessionToken = async ({ signInGql }) => {
  const sessionToken = await getSessionToken(signInGql);

  return createTestServer({
    context: () => ({ sessionToken })
  });
};

export { createTestServer, getSessionToken, createTestServerWithSessionToken };
