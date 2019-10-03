// import { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLList} from "graphql";
import { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLInt} from "graphql";
import { globalIdField } from "graphql-relay";
import { resolve } from "dns";

import { camelizeKeys } from "humps";

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
      type: StockLocationIdType,
      // Trying to use parent's resolve to force camelCase on the stock_location_id
      resolve:(parent)=>{
        return parent.stock_location_id
      }
    }
  })
});

const StockLocationIdType = new GraphQLObjectType({
  name: "StockLocationId",
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