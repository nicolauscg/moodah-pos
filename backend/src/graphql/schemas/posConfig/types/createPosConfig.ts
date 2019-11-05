import { GraphQLObjectType } from "graphql";
import { PosConfigType } from "./posConfig";
import { globalIdField } from "graphql-relay";

const CreatePosConfigType = new GraphQLObjectType({
  name: "CreateType",
  fields: () => ({
    id: globalIdField("pos.config"),
    posConfig: {
      type: PosConfigType
    }
  })
});

export { CreatePosConfigType };
