import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

const ReadPosCategoryType = new GraphQLObjectType({
  name: "ReadPosCategory",
  fields: () => ({
    id: globalIdField("pos.category"),
    name: {
      type: GraphQLString
    }
  })
});

export { ReadPosCategoryType };
