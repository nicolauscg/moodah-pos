/* eslint-disable @typescript-eslint/no-var-requires */
import {
  httpController,
  createService,
  createInsecureClientOptions,
  ServiceOperation
} from "nodoo";

interface GetDataSetParam {
  context: {
    sessionToken?: string;
  };
}
interface GetServiceParam {
  operation: ServiceOperation;
  onResult: (result: any) => any;
  onError: (error: any) => void;
}

// get operation for configureService that does not need auth
export const getSessionAuthNone = () =>
  httpController().operation.session.authNone;

// get operation for configureService that needs auth
export const getDataSet = ({ context }: GetDataSetParam) =>
  httpController().operation.dataSet({
    sessionToken: context.sessionToken
  });

// creates service with defaults
export const configureService = ({
  operation,
  onResult,
  onError
}: GetServiceParam) => {
  const clientOptions = createInsecureClientOptions({
    host: "178.128.103.135",
    port: 8069
  });

  createService({
    operation,
    clientOptions
  }).addListener({
    next: result => {
      result.fold(onError, onResult);
    }
  });
};

export const paginateOperationParam = (params, args) => ({
  ...params,
  limit: args.input.first,
  offset: args.input.offset
});

// eslint-disable-next-line consistent-return
const createDomainNone = element => {
  if (element.name !== undefined) {
    return ["name", "ilike", element.name];
  }
  if (element.stockLocationName !== undefined) {
    return ["stock_location_id", "ilike", element.stockLocationName];
  }
};

const createDomainOr = array => {
  const result = [];
  array.forEach(element => {
    result.push(createDomainNone(element));
  });

  return Array(array.length - 1)
    .fill("|")
    .concat(result);
};

// Logic constructor for OR,AND and ANDOR case
// eslint-disable-next-line consistent-return
const createFilterDomain = data => {
  // base case
  if (data === null) {
    return [];
  }
  if (data.OR !== undefined) {
    return createDomainOr(data.OR);
  }
  if (data.AND !== undefined) {
    const array = data.AND;
    const result = [];
    if (array[0].OR !== undefined) {
      array.forEach(element => {
        result.push(...createDomainOr(element.OR));
      });
    } else {
      array.forEach(element => {
        result.push(createDomainNone(element));
      });
    }

    return result;
  }
};

export const paginateAndFilterOperationParam = (params, args) => {
  // Create filterDomain

  const filterDomain =
    args.input.where === undefined ? [] : createFilterDomain(args.input.where);
  // Add the domain to the paginate param
  const result = {
    ...paginateOperationParam(params, args),
    domain: filterDomain
  };

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

// check args.OR contain list of object with only 1 key
// check args.AND contain list of object with only 1 key
// check only either .OR or .AND can be defined
export const isFilterArgsValid = args => {
  const data = args && args.input && args.input.where;

  return data === undefined
    ? true
    : checkListContainOneKeyObject(data.OR) &&
        checkListContainOneKeyObject(data.AND) &&
        (data.OR === undefined || data.AND === undefined);
};

// export function createDomainFilter(args) {
//   if (args.where === undefined) {
//     return [];
//   }
//   const result = [];
//   const data = args.where;

//   if (data.name !== undefined) {
//     result.push(["name", "ilike", data.name]);
//   }
//   if (data.stockLocationName !== undefined) {
//     result.push(["stock_location_id", "ilike", data.stockLocationName]);
//   }

//   return result;
// }
