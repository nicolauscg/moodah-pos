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
      db: "${process.env.odoo_db}",
      username: "${process.env.odoo_username}",
      password: "${process.env.odoo_password}"
    }) {
      sessionToken
    }
  }
`;
const SIGN_IN_WITH_WRONG_CREDENTIALS = gql`
mutation {
  signIn(input: {
    db: "${process.env.odoo_db}",
    username: "test",
    password: "test"
  }) {
    sessionToken
  }
}
`;

const GET_POS_CONFIGS_LOCATION = gql`
query {
  posConfigs {
    id
    name
    active
    stock_location_id{
      name
      usage
    }
  }
}`;

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
  it('correct credentials returns session token', async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN
    });
    expect(res.data.signIn.sessionToken).toEqual(expect.any(String));
  });

  it('incorrect credentials returns null', async () => {
    const server = createTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: SIGN_IN_WITH_WRONG_CREDENTIALS
    });
    expect(res.data.signIn.sessionToken).toBeNull();
  });
});


describe('Query', () => {
  it('return test query response', async() =>{
    const server = createTestServer();
    const { query } = createTestClient(server);
    const res = await query({ query: GET_POS_CONFIGS_LOCATION });
    expect(res.data.posConfigs).not.toBeNull(); 
  })
})