import { GraphQLObjectType } from "graphql";
import { PosProductType } from "./posProduct";
import { globalIdField } from "graphql-relay";

const CreatePosProductType = new GraphQLObjectType({
  name: "CreatePosProductType",
  fields: () => ({
    id: globalIdField("product.template"),
    posProduct: {
      type: PosProductType
    }
  })
});

export { CreatePosProductType };
