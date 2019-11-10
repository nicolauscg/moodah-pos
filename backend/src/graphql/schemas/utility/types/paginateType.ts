import { GraphQLObjectType, GraphQLInt, GraphQLList } from "graphql";

const PaginateType = (itemType: GraphQLObjectType): GraphQLObjectType =>
  new GraphQLObjectType({
    name: `Paginated${itemType.name}`,
    fields: () => ({
      length: {
        type: GraphQLInt
      },
      records: {
        type: GraphQLList(itemType)
      }
    })
  });

export { PaginateType };
