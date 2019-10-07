import { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList} from "graphql";
import { globalIdField } from "graphql-relay";

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
    stockLocationId: {
      type: StockLocationIdType,
      // Trying to use parent's resolve to force camelCase on the stock_location_id
      resolve:(parent)=>{
        return parent.stockLocationId
      }
    }
  })
});

const StockLocationIdType = new GraphQLObjectType({
  name: "stockLocationId",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve:(parent) =>{
        return parent[0]
      }
    },
    name: {
      type: GraphQLString,
      resolve:(parent) =>{
        return parent[1]
      }
    }
  })
})


export { PosConfigType };