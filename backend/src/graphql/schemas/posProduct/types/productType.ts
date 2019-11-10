import { GraphQLEnumType } from "graphql";

const ProductTypeType = new GraphQLEnumType({
  name: "ProductType",
  values: {
    consumable: { value: "consu" },
    service: { value: "service" },
    stockableProduct: { value: "product" }
  }
});

export { ProductTypeType };
