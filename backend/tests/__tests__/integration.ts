import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import {
  createTestServer,
  createTestServerWithSessionToken
} from "../utils";

// graphql payloads for testing
const GET_TEST = gql`
  {
    test
  }
`;
const GET_POS_CONFIGS = gql`
  query {
    posConfigs {
      id
      name
      active
    }
  }
`;
const SIGN_IN = gql`
  mutation {
    signIn(input: {
      db: "demo",
      username:"arini@rubyh.co",
      password: "password"
    }) {
      sessionToken
    }
  }
`;

describe('Query', () => {
  it('return test query response', async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: GET_TEST });
    expect(res.data.test).toEqual("test");
  });

  it('fetch pos configs without session token', async () => {
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS });
    expect(res.data.posConfigs).toBeNull();
  });

  it('fetch pos configs with session token', async () => {
    const server = await createTestServerWithSessionToken({
      signInGql: SIGN_IN
    });
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS });
    expect(res.data.posConfigs).not.toBeNull();
  });
});

describe('Mutations', () => {
  it('returns login token', async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN
    });
    expect(res.data.signIn.sessionToken).toEqual(expect.any(String));
  });
});

