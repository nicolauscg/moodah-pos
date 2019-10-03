// import { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLList} from "graphql";
import { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLInt} from "graphql";
import { globalIdField } from "graphql-relay";
import { resolve } from "dns";

const PosConfigType = new GraphQLObjectType({
  name: "PosConfig",
  fields: () => ({
    id: globalIdField("pos.config"),
    name: {
      type: GraphQLString
    },
    active: {
      type: GraphQLBoolean
    },
    stock_location_id: {
      type: StockLocationType
    }
  })
});

const StockLocationType = new GraphQLObjectType({
  name: "StockLocation",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve:(parent) =>{
        return parent[1]
      }
    },
    usage: {
      type: GraphQLInt,
      resolve:(parent) =>{
        return parent[0]
      }
    }
  })
})

export { PosConfigType };