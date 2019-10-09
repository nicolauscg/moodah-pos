import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList
} from "graphql";

const CURSOR_TYPE = GraphQLString;

const getPaginatedItemEdgesType = (itemType: GraphQLObjectType) =>
  new GraphQLObjectType({
    name: `PaginatedItem_${itemType.name}_Edges`,
    fields: () => ({
      node: {
        type: itemType
      },
      cursor: {
        type: CURSOR_TYPE
      }
    })
  });
const PaginatedItemPageInfoType = new GraphQLObjectType({
  name: "PaginatedItem_PageInfo",
  fields: () => ({
    endCursor: {
      type: CURSOR_TYPE
    },
    hasNextPage: {
      type: GraphQLBoolean
    }
  })
});

const getPaginatedItemType = (itemType: GraphQLObjectType) =>
  new GraphQLObjectType({
    name: `PaginatedItem_${itemType.name}`,
    fields: () => ({
      totalCount: {
        type: GraphQLInt
      },
      edges: {
        type: GraphQLList(getPaginatedItemEdgesType(itemType))
      },
      pageInfo: {
        type: PaginatedItemPageInfoType
      }
    })
  });

export { getPaginatedItemType };
