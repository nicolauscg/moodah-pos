import { GraphQLList, GraphQLInputObjectType } from "graphql";
import { PagableInputType } from "./pagableInput";

const addNestedOrFieldTo = (
  fields: GraphQLInputObjectType
): GraphQLInputObjectType =>
  new GraphQLInputObjectType({
    name: `Filterable${fields.name}_And`,
    fields: () => ({
      ...fields.getFields(),
      OR: {
        type: GraphQLList(fields)
      }
    })
  });

const FilterableAndPagableInputType = (
  filterFieldsObject: GraphQLInputObjectType
): GraphQLInputObjectType =>
  new GraphQLInputObjectType({
    name: `Filterable${filterFieldsObject.name}`,
    fields: () => ({
      where: {
        type: new GraphQLInputObjectType({
          name: `Filterable${filterFieldsObject.name}_where`,
          fields: () => ({
            OR: {
              type: GraphQLList(filterFieldsObject)
            },
            AND: {
              type: GraphQLList(addNestedOrFieldTo(filterFieldsObject))
            }
          })
        })
      },
      ...PagableInputType.getFields()
    })
  });

export { FilterableAndPagableInputType };
