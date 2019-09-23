import * as R from 'ramda'
import { format, utcToZonedTime } from 'date-fns-tz'
import idLocale from 'date-fns/locale/id'
import PropTypes from 'prop-types'

// ====================================================
// Types
// ====================================================
export interface OdooRecord {
  id: number | string
  name?: string
  displayName?: string
}

// ====================================================
// Constants
// ====================================================
export const AddOnContext = {
  isWoodInstalled: PropTypes.bool,
}

export const ErrorHandlerContext = {
  onError: PropTypes.func,
}

export const UserInfoContext = {
  showExpired: PropTypes.bool,
  name: PropTypes.string,
  isStandardPlan: PropTypes.bool,
}

export const ProOnlyFeatures = [
  { path: 'landing_costs', feature: 'Landed Costs' },
  { path: 'landed_cost_types', feature: 'Landed Cost Types' },
  { path: 'batch_picking', feature: 'Batch Picking' },
  { path: 'serial_numbers', feature: 'Serial Numbers' },
  { path: 'intelligence', feature: 'Intelligence' },
]

export const JoyrideHelpersCtx = {
  joyrideHelpers: PropTypes.object,
}

// ====================================================
// Helpers
// ====================================================
export const toSuggestion = (data: {
  id: number | string
  name?: string
  displayName?: string
}) => {
  return R.pipe(
    renameKeys({
      id: 'value',
    }),
    R.ifElse(
      R.has('displayName'),
      renameKeys({
        displayName: 'label',
      }),
      renameKeys({
        name: 'label',
      })
    ),
    R.ifElse(R.propEq('label', false), R.assoc('label', ''), R.identity)
  )(data)
}

export const toSuggestions = (data: OdooRecord[]) => {
  return R.map(toSuggestion, data)
}

const jktTimezone = 'Asia/Jakarta'

export const fromOdooDatetime = (datetime: string) =>
  utcToZonedTime(`${datetime} Z`, jktTimezone)

export const formatDatetime = (
  pattern: string,
  datetime: Date | string | number
) =>
  format(datetime, pattern, {
    timeZone: jktTimezone,
    awareOfUnicodeTokens: true,
    locale: idLocale,
  })

export const convertToWIB = R.curry((pattern: string, datetime: string) =>
  R.ifElse(
    d => R.or(R.isNil(d), R.equals(false, d)),
    R.identity,
    R.pipe(
      fromOdooDatetime,
      R.partial(formatDatetime, [pattern])
    )
  )(datetime)
)

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
)

export const spreadPath = R.curryN(
  2,
  R.converge(R.merge, [R.dissocPath, R.pathOr({})])
)

export const mergeProps = R.curryN(
  2,
  R.pipe(
    R.props,
    // @ts-ignore
    R.mergeAll
  )
)

export const referenceLabelToOdoo = R.ifElse(
  R.isNil,
  R.identity,
  R.prop('label')
)

export const referenceToOdoo = R.ifElse(R.isNil, R.identity, R.prop('value'))

export const referenceFromOdoo = R.ifElse(R.isNil, R.identity, toSuggestion)

export const referenceNameFromOdoo = R.ifElse(
  R.isNil,
  R.identity,
  item => item.name || item.displayName
)
export const referenceIdFromOdoo = R.ifElse(R.isNil, R.identity, R.prop('id'))

export const getValueOdooSelection = R.pipe(
  R.find(R.propEq('selected', true)),
  R.prop('value')
)

export const getLabelOdooSelection = R.pipe(
  R.find(R.propEq('selected', true)),
  R.prop('label')
)

export const selectionFromOdoo = R.pipe(
  R.find(R.propEq('selected', true)),
  R.ifElse(R.isNil, R.always(null), toSuggestion)
)

export const textFromOdoo = R.ifElse(R.equals(false), R.always(''), R.identity)

export const textToOdoo = R.ifElse(R.isEmpty, R.always(null), R.identity)

export const datetimeFromOdoo = R.cond([
  [R.isNil, R.identity],
  [R.equals(false), R.identity],
  [R.T, fromOdooDatetime],
])

export const datetimeToOdoo = R.cond([
  [R.isNil, R.identity],
  [R.equals(false), R.identity],
  [R.T, R.partial(formatDatetime, ['YYYY-MM-dd HH:mm:ss'])],
])

export const dateToOdoo = R.cond([
  [R.isNil, R.identity],
  [R.equals(false), R.identity],
  [R.T, R.partial(formatDatetime, ['YYYY-MM-dd'])],
])

export const datetimeToShow = R.cond([
  [R.isNil, R.identity],
  [R.equals(false), R.identity],
  [R.T, R.partial(formatDatetime, ['dd MMM YYYY HH:mm:ss'])],
])

export const dateToShow = R.cond([
  [R.isNil, R.identity],
  [R.equals(false), R.identity],
  [R.T, R.partial(formatDatetime, ['dd MMM YYYY'])],
])

export const downloadReport = (response: string, name: string) => {
  let link = document.createElement('a')
  link.href = `data:application/pdf;base64,${response}`
  link.download = `${name}.pdf`
  link.click()
}

export const downloadXls = (data: string, name: string = 'File') => {
  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.ms-excel' })
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.xls`
  link.click()
}

export const toCurrency = (
  value: number,
  locale?: string,
  options?: Object
) => {
  return toNumber(
    value,
    locale,
    options || {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 2,
    }
  )
}

export const toNumber = (
  value: number,
  locale: string = 'id',
  options?: Object
) => {
  return new Intl.NumberFormat(locale, options).format(value)
}

export const getNullKeys = val => R.complement(R.isNil)(val)

export const prepareMailMessages = messages => {
  return R.ifElse(
    R.isEmpty,
    R.identity,
    R.map(
      R.evolve({
        authorId: R.prop('displayName'),
        date: R.pipe(
          fromOdooDatetime,
          datetimeToOdoo
        ),
        trackingValueIds: R.prop('trackingValueIds'),
      })
    )
  )(messages)
}

export const one2many = (deletedLines: any[]) =>
  R.pipe(
    R.groupBy(function(line: any) {
      if (!line.id) return 'CREATE'
      if (
        line.id.includes('virtual') ||
        line.id.includes('scanVirtual') ||
        line.id.includes('batchTemp')
      )
        return 'CREATE'
      if (line.id && Object.keys(line).length >= 2) return 'UPDATE'
    }),
    R.evolve({ CREATE: R.map(R.dissoc('id')) }),
    R.assoc('DELETE', deletedLines)
  )

export function addMonths(date: Date, months) {
  date.setMonth(date.getMonth() + months)
  return date
}

export function addYears(date: Date, years) {
  date.setFullYear(date.getFullYear() + years)
  return date
}

export function getGraphQLErrors(error) {
  return R.pathOr(
    '',
    ['graphQLErrors', 0, 'extensions', 'exception', 'errorMessages'],
    error
  )
}

export const roundTo2 = (number: number) => Math.round(number * 100) / 100

export const groupByIdType = line => {
  if (!line.id) return 'CREATE'
  return line.id.includes('virtual') ? 'CREATE' : 'UPDATE'
}

export const numberToOdoo = R.cond([
  [R.isNil, R.always(0)],
  [R.equals(false), R.always(0)],
  [R.T, R.identity],
])

export const numberFromOdoo = R.cond([
  [R.isNil, R.always(0)],
  [R.equals(false), R.always(0)],
  [R.T, R.identity],
])

export const formatBigNumber = value => {
  if (value > 1000000000000) {
    return (value / 1000000000000).toString() + 'B'
  } else if (value > 1000000000) {
    return (value / 1000000000).toString() + 'B'
  } else if (value > 1000000) {
    return (value / 1000000).toString() + 'M'
  } else if (value > 1000) {
    return (value / 1000).toString() + 'K'
  } else {
    return value.toString()
  }
}
