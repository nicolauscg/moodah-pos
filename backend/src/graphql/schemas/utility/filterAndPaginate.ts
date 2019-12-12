import { CreateSearchReadParams } from "nodoo/dist/types/controllers/http/operations/model/searchRead";
import { paginateOperationParam } from "./paginate";
import { FilterField } from "./types/filter";
import { ResolverArgs } from "./types/args";

// eslint-disable-next-line consistent-return
const createDomainNone = (element, models) => {
  // eslint-disable-next-line guard-for-in
  for (const idx in models) {
    const model = models[idx];
    if (element[model.conventionName] !== undefined) {
      return [model.domainName, model.operator, element[model.conventionName]];
    }
  }
};

const createDomainOr = (array, models) => {
  const result = [];
  array.forEach(element => {
    result.push(createDomainNone(element, models));
  });

  return Array(array.length - 1)
    .fill("|")
    .concat(result);
};

// Logic constructor for OR,AND and AND OR case
// eslint-disable-next-line consistent-return
const createFilterDomain = (data, models) => {
  // base case
  if (data === null) {
    return [];
  }
  if (data.OR !== undefined) {
    return createDomainOr(data.OR, models);
  }
  if (data.AND !== undefined) {
    const array = data.AND;
    const result = [];
    if (array[0].OR !== undefined) {
      array.forEach(element => {
        result.push(...createDomainOr(element.OR, models));
      });
    } else {
      array.forEach(element => {
        result.push(createDomainNone(element, models));
      });
    }

    return result;
  }
};

const paginateAndFilterOperationParam = (
  params: CreateSearchReadParams,
  models: Array<FilterField>,
  args: ResolverArgs
): CreateSearchReadParams => {
  // Create filterDomain
  const filterDomain =
    args.input.where === undefined
      ? []
      : createFilterDomain(args.input.where, models);
  // Add the domain to the paginate param
  const result = {
    ...paginateOperationParam(params, args)
  };
  result.domain = result.domain.concat(filterDomain || []);

  return result;
};

// recursively checks wether list of objects have only one key
// eslint-disable-next-line no-confusing-arrow
const checkListContainOneKeyObject = (objectList: Array<any>) =>
  !objectList
    ? true
    : objectList
        .map(field => {
          const keys = Object.keys(field);
          if (Array.isArray(field[keys[0]])) {
            return checkListContainOneKeyObject(field[keys[0]]);
          }

          if (keys.length !== 1) {
            return false;
          }

          return true;
        })
        .every(valid => valid === true);

// args is valid for filtering
const isFilterArgsValid = (args: ResolverArgs): boolean => {
  const data = args && args.input && args.input.where;

  return data === undefined
    ? true
    : checkListContainOneKeyObject(data.OR) &&
        checkListContainOneKeyObject(data.AND) &&
        (data.OR === undefined || data.AND === undefined);
};

export { paginateAndFilterOperationParam, isFilterArgsValid };
