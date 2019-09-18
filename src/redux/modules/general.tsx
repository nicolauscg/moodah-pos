import {
  pipe,
  ifElse,
  has,
  curry,
  reduce,
  assoc,
  keys,
  curryN,
  converge,
  merge,
  dissocPath,
  pathOr,
  map,
} from 'ramda'
import { Reducer } from 'redux'
import { action } from 'typesafe-actions'
import { format, utcToZonedTime } from 'date-fns-tz'
import idLocale from 'date-fns/locale/id'

import {
  GeneralState,
  GeneralActionTypes,
  Notif,
  OdooRecord,
  DialogObject,
} from '../types/general'

const initialState: GeneralState = {
  notifs: [],
  dialogState: false,
  dialogContent: {
    title: '',
    message: '',
  },
}

// Reducer
export const generalReducer: Reducer<GeneralState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GeneralActionTypes.ADD_NOTIF:
      return {
        ...state,
        notifs: [action.payload, ...state.notifs],
      }
    case GeneralActionTypes.REMOVE_NOTIF:
      return {
        ...state,
        notifs: state.notifs.filter(notif => notif.id !== action.payload),
      }
    case GeneralActionTypes.SHOW_DIALOG:
      return {
        ...state,
        dialogState: true,
        dialogContent: action.payload,
      }
    case GeneralActionTypes.HIDE_DIALOG:
      return {
        ...state,
        dialogState: false,
        dialogContent: {
          title: '',
          message: '',
        },
      }
    default:
      return state
  }
}

// Actions
export const addNotif = (notif: Notif) => {
  return action(GeneralActionTypes.ADD_NOTIF, prepareNotif(notif))
}

export const removeNotif = (id: number) => {
  return action(GeneralActionTypes.REMOVE_NOTIF, id)
}

export const showDialog = (dialog: DialogObject) => {
  return action(GeneralActionTypes.SHOW_DIALOG, dialog)
}

export const hideDialog = () => {
  return action(GeneralActionTypes.HIDE_DIALOG)
}

// Helper functions
export const handleNullValue = (value: any) => {
  if (typeof value !== 'number') {
    return value ? value : ''
  }

  return value
}

export const getAccessToken = () => localStorage.getItem('accessToken')

export const toSuggestion = (data: {
  id: number | string
  name?: string
  displayName?: string
}) => {
  return pipe(
    renameKeys({
      id: 'value',
    }),
    ifElse(
      has('displayName'),
      renameKeys({
        displayName: 'label',
      }),
      renameKeys({
        name: 'label',
      })
    )
  )(data)
}

export const toSuggestions = (data: OdooRecord[]) => {
  return map(toSuggestion, data)
}

let id = 0

export const prepareNotif = (notif: Notif) => {
  return {
    id: id++,
    ...notif,
  }
}

export const fromOdooDatetime = (datetime: string) => {
  const jktTimezone = 'Asia/Jakarta'

  return utcToZonedTime(`${datetime} Z`, jktTimezone)
}

export const formatDatetime = (pattern: string, datetime: Date) => {
  const jktTimezone = 'Asia/Jakarta'

  return format(
    datetime,
    pattern,

    { timeZone: jktTimezone, awareOfUnicodeTokens: true, locale: idLocale }
  )
}

// Ramda cookbook functions
export const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
)

export const spreadPath = curryN(2, converge(merge, [dissocPath, pathOr({})]))
