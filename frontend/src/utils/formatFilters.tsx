import _ from 'lodash'

export type FilterObject = {
  field?: string,
  operator?: string,
  comparator?: string | number | string[] | number[] | boolean,
  logicOperator?: string,
}

const formatFilters = (filters: FilterObject[]) => {
  let filterArrString = filters.map((filter, idx, arr) => {
    if (filter.logicOperator) {
      return `'${filter.logicOperator}'`
    }
    else {
      if (Array.isArray(filter.comparator)) {
        const combinedComparators = (filter.comparator as any[]).map((value: any) => {
          if (typeof value === 'string') {
            return "'"+value+"'";
          }
          return value;
        });

        return `('${filter.field}', '${filter.operator}', [${combinedComparators}])`
      }

      if (typeof filter.comparator === typeof true) {
        return `('${filter.field}', '${filter.operator}', ${_.capitalize(filter.comparator.toString())})`
      }

      return typeof filter.comparator === 'number'
        ? `('${filter.field}', '${filter.operator}', ${filter.comparator})`
        : `('${filter.field}', '${filter.operator}', '${filter.comparator}')`
    }
  })

  return `[${filterArrString.join(',')}]`
}

export default formatFilters
