export default {
  queryAll: {
    length: 1,
    records: [
      {
        name: "Appetizer",
        displayName: "Food Menu / Appetizer",
        image: "64encodedImage",
        parentId: [80, "Food Menu"],
        sequence: 0,
        id: 82
      }
    ]
  },
  queryRead: [
    {
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
  mutationCreate: {
    id: 80
  },
  mutationUpdate: true,
  mutationDelete: true
};
