import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import { schema } from '../src/graphql/schema';

const createTestServer = (
  { context = {} } = { context: () => {} }
) => new ApolloServer({
  schema,
  formatError: error => {
    return error;
  },
  formatResponse: response => {
    return response;
  },
  context
});

const getSessionToken = async (signInGql) => {
  const server = createTestServer();
  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: signInGql
  });

  return res.data.signIn.sessionToken;
}

// create test server with context set with sessionToken
const createTestServerWithSessionToken = async ({ signInGql }) =>  {
  const sessionToken = await getSessionToken(signInGql);

  return createTestServer({
    context: () => ({ sessionToken })
  })
};

// create test for fetching posConfig data
// const createTestServerFetchposConfig = async ({ signInGql }) => {
//   const sessionToken = await getSessionToken(signInGql);

//   it('should be null when user is not logged in', async () => {
//     //language=GraphQL
//     const query = `
//       query {
//         posConfigs {
//           id
//           name
//           active
//           stock_location_id{
//             name
//             usage
//           }
//         }
//       }
//     `;
    
//   // const rootValue = {};
//   // const context = getContext();

//   // const result = await graphql(schema, query, rootValue, context);
//   // const { data } = result;

//   // expect(data.viewer.me).toBe(null);
// });
// }

export {
  createTestServer,
  getSessionToken,
  createTestServerWithSessionToken
}