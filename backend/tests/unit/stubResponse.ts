import { toGlobalId } from "graphql-relay";

export const posCategory = {
  id: toGlobalId("pos.category", String(82)),
  name: "Appetizer",
  displayName: "Food Menu / Appetizer",
  image: "64encodedImage",
  parent: {
    id: toGlobalId("pos.category", String(80)),
    name: "Food Menu",
    displayName: "Food Menu"
  },
  sequence: 0
};

export default {
  queryAll: {
    length: 1,
    records: [
      {
        globalIdType: "pos.category",
        id: 82,
        name: "Appetizer",
        displayName: "Food Menu / Appetizer",
        image: "64encodedImage",
        parentId: [80, "Food Menu"],
        sequence: 0
      }
    ]
  },
  queryRead: [
    {
      globalIdType: "pos.category",
      id: 82,
      name: "Appetizer",
      displayName: "Food Menu / Appetizer",
      image: "64encodedImage",
      parentId: [80, "Food Menu"],
      sequence: 0
    }
  ],
  nestedQueryParent: [
    {
      id: 80,
      name: "Food Menu",
      displayName: "Food Menu"
    }
  ],
  mutationCreate: 82,
  mutationUpdate: true,
  mutationDelete: true
};
