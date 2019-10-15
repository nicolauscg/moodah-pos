import { GraphQLString, GraphQLInputObjectType, GraphQLInt } from "graphql";

const CreateOrUpdatePosCategoryInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosCategoryInputType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLInt
    },
    image: {
      type: GraphQLString
    },
    sequence: {
      type: GraphQLInt
    }
  })
});

export { CreateOrUpdatePosCategoryInputType };
