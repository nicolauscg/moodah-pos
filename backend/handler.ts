import { ApolloServer } from "apollo-server-lambda";
import lambdaPlayground from "graphql-playground-middleware-lambda";
import { schema } from "./src/graphql/schemas";
import "source-map-support/register";

const server = new ApolloServer({
  schema,
  formatError: error => error,
  formatResponse: response => response,
  context: ({ event }) => {
    const sessionToken = event.headers.Authorization || "";

    return { sessionToken };
  },
  introspection: true
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*"
  }
});

exports.playgroundHandler = lambdaPlayground({
  endpoint: process.env.IS_OFFLINE
    ? `http://localhost:${process.env.PORT}/graphql-introspect`
    : `/${process.env.STAGE}/graphql-introspect`
});
