import { GraphQLString, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { GlobalIdInput } from "../../utility/types/globalIdInput";

const CreateOrUpdatePosCategoryInputType = new GraphQLInputObjectType({
  name: "CreateOrUpdatePosCategoryInput",
  fields: () => ({
    id: {
      type: GlobalIdInput
    },
    name: {
      type: GraphQLString
    },
    parentId: {
      type: GlobalIdInput
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
