import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { globalIdField } from "graphql-relay";

const PosCategoryParentType = new GraphQLObjectType({
  name: "PosCategoryParent",
  fields: () => ({
    id: globalIdField("pos.category", parent => parent[0]),
    name: {
      type: GraphQLString,
      resolve: parent => parent[1]
    }
  })
});

const PosCategoryType = new GraphQLObjectType({
  name: "PosCategory",
  fields: () => ({
    id: globalIdField("pos.category"),
    name: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString,
      resolve: parent => (parent.image === false ? null : parent.image)
    },
    parent: {
      type: PosCategoryParentType,
      resolve: parent => (parent.parentId === false ? null : parent.parentId)
    },
    sequence: {
      type: GraphQLInt
    }
  })
});

export { PosCategoryType };
