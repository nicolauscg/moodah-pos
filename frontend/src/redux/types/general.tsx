import { FilterObject } from '../../utils/formatFilters'

export type FetchParams = {
  filters: FilterObject[]
  limit?: number
  offset?: number
}

export interface Suggestion {
  label: string
  value: string | number
}

export interface Notif {
  message: string
  type: NotifTypes
}

export interface NotifObject extends Notif {
  id: number
}

export interface DialogObject {
  title: string
  message: string
}

export type NotifTypes = 'success' | 'danger' | 'warning'

export interface OdooRecord {
  id: number | string
  name?: string
  displayName?: string
}

export const enum GeneralActionTypes {
  ADD_NOTIF = '@@general/ADD_NOTIF',
  REMOVE_NOTIF = '@@general/REMOVE_NOTIF',
  SHOW_DIALOG = '@@general/SHOW_DIALOG',
  HIDE_DIALOG = '@@general/HIDE_DIALOG',
  CLEAR_DIALOG = '@@general/CLEAR_DIALOG',
}

export interface GeneralState {
  readonly notifs: NotifObject[]
  readonly dialogState: Boolean
  readonly dialogContent: DialogObject
}
