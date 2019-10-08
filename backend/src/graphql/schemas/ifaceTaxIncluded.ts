import { GraphQLEnumType } from "graphql";

const IfaceTaxIncludedType = new GraphQLEnumType({
  name: "IfaceTaxIncluded",
  values: {
    total: { value: "total" },
    subtotal: { value: "subtotal" }
  }
});

export { IfaceTaxIncludedType };
