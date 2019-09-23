import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import { schema } from './../src/graphql/schema';

test('fetches single launch', async () => {
  const GET_TEST = gql`
    {
      name
    }
  `;

  const server = new ApolloServer({
    schema,
    formatError: error => {
      return error;
    },
    formatResponse: response => {
      return response;
    }
  });

  const { query } = createTestClient(server);

  const res = await query({ query: GET_TEST });
  expect(res).toMatchObject({
    "data": {
      "name": "test"
    }
  });
});