import { Reducer, Dispatch } from 'redux'
import { action, ActionType } from 'typesafe-actions'
import { call, put, fork, all, takeLatest } from 'redux-saga/effects'
import { camelizeKeys, decamelizeKeys } from 'humps'
import React from 'react'
import {
  dissoc,
  map,
  cond,
  propEq,
  T,
  always,
  ifElse,
  isEmpty,
  pipe,
  find,
  evolve,
  prop,
  assoc,
  path,
  set,
  lensProp,
} from 'ramda'

import { Link } from 'react-router-dom'

// @ts-ignore
import api from '../../utils/api'
import {
  PartnerState,
  PartnerActionTypes,
  FetchPartnersResp,
  FetchCountriesResp,
  FetchStatesResp,
  FetchPaymentTermsResp,
  FetchUsersResp,
  ResPartner,
  CamelResPartnerSingle,
  ResPartnerChild,
  ResCountry,
  ResCountryState,
  PartnerFormVals,
} from '../types/partner'
import { FetchParams, Suggestion } from '../types/general'
import formatFilters from '../../utils/formatFilters'
import {
  getAccessToken,
  handleNullValue,
  renameKeys,
  toSuggestions,
  addNotif,
} from './general'

export const initialState: PartnerState = {
  partnersState: {
    kind: 'Fetching',
  },
  partnerParams: {
    filters: [
      { logicOperator: '|' },
      { field: 'customer', operator: '=', comparator: 'True' },
      { field: 'supplier', operator: '=', comparator: 'True' },
      { field: 'type', operator: '=', comparator: 'contact' },
    ],
    limit: 10,
    offset: 0,
  },
  partnerState: {
    kind: 'Fetching',
  },
  countriesState: {
    kind: 'Fetching',
  },
  shippingStatesState: {
    kind: 'Fetching',
  },
  billingStatesState: {
    kind: 'Fetching',
  },
  createPartnerState: {
    kind: 'Draft',
  },
  paymentTermsState: {
    kind: 'Fetching',
  },
  usersState: {
    kind: 'Fetching',
  },
}

// Reducer
export const partnerReducer: Reducer<PartnerState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case PartnerActionTypes.FETCH_PARTNER:
      return {
        ...state,
        partnersState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_PARTNER_SUCCESS:
      return {
        ...state,
        partnersState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.UPDATE_FETCH_PARAMS:
      return {
        ...state,
        partnerParams: action.payload,
      }
    case PartnerActionTypes.FETCH_SINGLE_PARTNER:
      return {
        ...state,
        partnerState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS:
      return {
        ...state,
        partnerState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.FETCH_COUNTRIES:
      return {
        ...state,
        countriesState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        countriesState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.FETCH_SHIPPING_STATES:
      return {
        ...state,
        shippingStatesState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_SHIPPING_STATES_SUCCESS:
      return {
        ...state,
        shippingStatesState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.RESET_SHIPPING_STATES:
      return {
        ...state,
        shippingStatesState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_BILLING_STATES:
      return {
        ...state,
        billingStatesState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_BILLING_STATES_SUCCESS:
      return {
        ...state,
        billingStatesState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.RESET_BILLING_STATES:
      return {
        ...state,
        billingStatesState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.CREATE_PARTNER:
      return {
        ...state,
        createPartnerState: {
          kind: 'Submit',
        },
      }
    case PartnerActionTypes.CREATE_PARTNER_SUCCESS:
      return {
        ...state,
        createPartnerState: {
          kind: 'Success',
          partnerId: action.payload,
        },
      }
    case PartnerActionTypes.RESET_CREATE_PARTNER:
      return {
        ...state,
        createPartnerState: {
          kind: 'Draft',
        },
      }
    case PartnerActionTypes.FETCH_PAYMENT_TERMS:
      return {
        ...state,
        paymentTermsState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_PAYMENT_TERMS_SUCCESS:
      return {
        ...state,
        paymentTermsState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    case PartnerActionTypes.FETCH_USERS:
      return {
        ...state,
        usersState: {
          kind: 'Fetching',
        },
      }
    case PartnerActionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        usersState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    default:
      return state
  }
}

// Actions
export const getPartners = (params: FetchParams, dispatch: Dispatch) => {
  const formattedFilters = formatFilters(params.filters)
  return action(
    PartnerActionTypes.FETCH_PARTNER,
    { ...params, filters: formattedFilters },
    dispatch
  )
}

const getPartnersSuccess = (response: FetchPartnersResp) => {
  const { results, total } = response
  const tableRows = Array.isArray(results) ? preparePartnerTable(results) : []

  return action(PartnerActionTypes.FETCH_PARTNER_SUCCESS, {
    partners: tableRows,
    total,
  })
}

export const getPartner = (id: string, dispatch: Dispatch) =>
  action(PartnerActionTypes.FETCH_SINGLE_PARTNER, id, dispatch)

const getPartnerSuccess = (
  response: CamelResPartnerSingle,
  dispatch: Dispatch
) => {
  const transformedResp = preparePartnerForm(response)

  return action(
    PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS,
    transformedResp,
    dispatch
  )
}

export const setParams = (newParams: FetchParams, dispatch: Dispatch) => {
  const { filters } = newParams
  // const appendedFilters = [
  //   ...filters,
  //   { field: 'type', operator: '=', comparator: 'contact' },
  // ]

  return action(PartnerActionTypes.UPDATE_FETCH_PARAMS, newParams, dispatch)
}

export const getCountries = (dispatch: Dispatch) =>
  action(PartnerActionTypes.FETCH_COUNTRIES, undefined, dispatch)

const getCountriesSuccess = (response: FetchCountriesResp) => {
  const { results } = response
  // @ts-ignore
  const countries = toSuggestions(results)

  return action(PartnerActionTypes.FETCH_COUNTRIES_SUCCESS, countries)
}

const getShippingStatesSuccess = (response: FetchStatesResp) => {
  const { results } = response
  const suggestions = Array.isArray(results) ? toSuggestions(results) : []

  return action(PartnerActionTypes.FETCH_SHIPPING_STATES_SUCCESS, suggestions)
}

export const setShippingCountry = (
  newParams: FetchParams,
  dispatch: Dispatch
) => {
  const { filters, ...restParams } = newParams
  const formattedFilters = formatFilters(filters)

  return action(
    PartnerActionTypes.FETCH_SHIPPING_STATES,
    { ...restParams, filters: formatFilters(newParams.filters) },
    dispatch
  )
}

export const resetShippingStates = () =>
  action(PartnerActionTypes.RESET_SHIPPING_STATES)

const getBillingStatesSuccess = (response: FetchStatesResp) => {
  const { results } = response
  const suggestions = Array.isArray(results) ? toSuggestions(results) : []

  return action(PartnerActionTypes.FETCH_BILLING_STATES_SUCCESS, suggestions)
}

export const setBillingCountry = (
  newParams: FetchParams,
  dispatch: Dispatch
) => {
  const { filters, ...restParams } = newParams
  const formattedFilters = formatFilters(filters)

  return action(
    PartnerActionTypes.FETCH_BILLING_STATES,
    { ...restParams, filters: formatFilters(newParams.filters) },
    dispatch
  )
}

export const resetBillingStates = () =>
  action(PartnerActionTypes.RESET_BILLING_STATES)

export const updatePartner = (
  formValues: PartnerFormVals,
  dispatch: Dispatch
) => {
  const transformedValues = transformPartnerForm(formValues)

  return action(PartnerActionTypes.UPDATE_PARTNER, transformedValues, dispatch)
}

export const submitPartner = (
  formValues: PartnerFormVals,
  dispatch: Dispatch
) => {
  const transformedValues = transformPartnerForm(formValues)

  return action(PartnerActionTypes.CREATE_PARTNER, transformedValues, dispatch)
}

const submitPartnerSuccess = (id: number) =>
  action(PartnerActionTypes.CREATE_PARTNER_SUCCESS, id)

export const resetSubmitPartner = () =>
  action(PartnerActionTypes.RESET_CREATE_PARTNER)

export const getPaymentTerms = (dispatch: Dispatch) =>
  action(PartnerActionTypes.FETCH_PAYMENT_TERMS, undefined, dispatch)

const getPaymentTermsSuccess = (response: FetchPaymentTermsResp) => {
  const { results } = response
  const terms = Array.isArray(results) ? toSuggestions(results) : []

  return action(PartnerActionTypes.FETCH_PAYMENT_TERMS_SUCCESS, terms)
}

export const getUsers = (dispatch: Dispatch) =>
  action(PartnerActionTypes.FETCH_USERS, undefined, dispatch)

const getUsersSuccess = (response: FetchUsersResp) => {
  const { results } = response
  const terms = Array.isArray(results) ? toSuggestions(results) : []

  return action(PartnerActionTypes.FETCH_USERS_SUCCESS, terms)
}

// Sagas
function* fetchPartners(action: ActionType<typeof getPartners>) {
  try {
    const token = yield call(getAccessToken)
    const response = yield call(
      api.get,
      '/res.partner',
      action.payload,
      { 'Access-Token': token },
      // @ts-ignore
      action.meta
    )
    yield put(getPartnersSuccess(camelizeKeys(response) as FetchPartnersResp))
  } catch (error) {
    console.log(error)
  }
}

function* updateParams(action: ActionType<typeof setParams>) {
  yield put(getPartners(action.payload, action.meta))
}

function* fetchPartner(action: ActionType<typeof getPartner>) {
  try {
    const token = yield call(getAccessToken)
    const response = yield call(
      api.get,
      `/res.partner/${action.payload}`,
      undefined,
      { 'Access-Token': token },
      action.meta
    )
    yield put(
      getPartnerSuccess(
        camelizeKeys(response) as CamelResPartnerSingle,
        action.meta
      )
    )
  } catch (error) {
    console.log(error)
  }
}

function* updatePartnerServer(action: ActionType<typeof updatePartner>) {
  try {
    const token = yield call(getAccessToken)
    // @ts-ignore
    const partnerId = action.payload.id

    const response = yield call(
      api.put,
      `/res.partner/${partnerId}`,
      JSON.stringify(dissoc('id', decamelizeKeys(action.payload))),
      { 'Access-Token': token },
      action.meta
    )

    yield put(getPartner(partnerId, action.meta))

    yield put(
      addNotif({
        message: 'Partner details updated',
        type: 'success',
      })
    )
  } catch (error) {
    console.log(error)
  }
}

function* createPartner(action: ActionType<typeof submitPartner>) {
  try {
    const token = yield call(getAccessToken)

    const response: { id: number } = yield call(
      api.post,
      '/res.partner',
      JSON.stringify(decamelizeKeys(action.payload)),
      { 'Access-Token': token },
      action.meta
    )

    yield put(submitPartnerSuccess(response.id))

    yield put(
      addNotif({
        message: 'Partner successfully created',
        type: 'success',
      })
    )
  } catch (error) {
    console.log(error)
  }
}

function* partnerWatcher() {
  yield all([
    takeLatest(PartnerActionTypes.FETCH_PARTNER, fetchPartners),
    takeLatest(PartnerActionTypes.UPDATE_FETCH_PARAMS, updateParams),
    takeLatest(PartnerActionTypes.FETCH_SINGLE_PARTNER, fetchPartner),
    takeLatest(PartnerActionTypes.UPDATE_PARTNER, updatePartnerServer),
    takeLatest(PartnerActionTypes.CREATE_PARTNER, createPartner),
  ])
}

function* fetchCountries(action: ActionType<typeof getCountries>) {
  try {
    const token = yield call(getAccessToken)
    const response = yield call(
      api.get,
      '/res.country',
      undefined,
      { 'Access-Token': token },
      action.meta
    )

    yield put(getCountriesSuccess(camelizeKeys(response) as FetchCountriesResp))
  } catch (error) {
    console.log(error)
  }
}

function* countriesWatcher() {
  yield takeLatest(PartnerActionTypes.FETCH_COUNTRIES, fetchCountries)
}

function* fetchShippingStates(
  action:
    | ActionType<typeof getPartnerSuccess>
    | ActionType<typeof setShippingCountry>
) {
  try {
    const token = yield call(getAccessToken)
    let data

    if (action.type === PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS) {
      // @ts-ignore
      const {
        deliveryAddress: { shippingCountryId },
      } = action.payload

      const filters = shippingCountryId.value
        ? [
            {
              field: 'country_id',
              operator: '=',
              comparator: shippingCountryId.value,
            },
          ]
        : []

      data = {
        filters: formatFilters(filters),
      }
    } else {
      data = action.payload
    }

    const response = yield call(
      api.get,
      '/res.country.state',
      data,
      { 'Access-Token': token },
      action.meta
    )
    yield put(
      getShippingStatesSuccess(camelizeKeys(response) as FetchStatesResp)
    )
  } catch (error) {
    console.log(error)
  }
}

function* fetchBillingStates(
  action:
    | ActionType<typeof getPartnerSuccess>
    | ActionType<typeof setBillingCountry>
) {
  try {
    const token = yield call(getAccessToken)
    let data

    if (action.type === PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS) {
      // @ts-ignore
      const {
        invoiceAddress: { billingCountryId },
      } = action.payload

      const filters = billingCountryId.value
        ? [
            {
              field: 'country_id',
              operator: '=',
              comparator: billingCountryId.value,
            },
          ]
        : []

      data = {
        filters: formatFilters(filters),
      }
    } else {
      data = action.payload
    }

    const response = yield call(
      api.get,
      '/res.country.state',
      data,
      { 'Access-Token': token },
      action.meta
    )
    yield put(
      getBillingStatesSuccess(camelizeKeys(response) as FetchStatesResp)
    )
  } catch (error) {
    console.log(error)
  }
}

function* statesWatcher() {
  yield all([
    takeLatest(
      PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS,
      fetchShippingStates
    ),
    takeLatest(PartnerActionTypes.FETCH_SHIPPING_STATES, fetchShippingStates),
    takeLatest(
      PartnerActionTypes.FETCH_SINGLE_PARTNER_SUCCESS,
      fetchBillingStates
    ),
    takeLatest(PartnerActionTypes.FETCH_BILLING_STATES, fetchBillingStates),
  ])
}

function* fetchPaymentTerms(action: ActionType<typeof getPaymentTerms>) {
  try {
    const token = yield call(getAccessToken)
    const filters = yield call(formatFilters, [
      { field: 'active', operator: '=', comparator: 'True' },
    ])

    const response = yield call(
      api.get,
      '/account.payment.term',
      { filters },
      { 'Access-Token': token },
      action.meta
    )

    yield put(
      getPaymentTermsSuccess(camelizeKeys(response) as FetchPaymentTermsResp)
    )
  } catch (error) {
    console.log(error)
  }
}

function* paymentTermsWatcher() {
  yield takeLatest(PartnerActionTypes.FETCH_PAYMENT_TERMS, fetchPaymentTerms)
}

function* fetchUsers(action: ActionType<typeof getUsers>) {
  try {
    const token = yield call(getAccessToken)

    const response = yield call(
      api.get,
      '/res.users',
      undefined,
      { 'Access-Token': token },
      action.meta
    )

    yield put(getUsersSuccess(camelizeKeys(response) as FetchPaymentTermsResp))
  } catch (error) {
    console.log(error)
  }
}

function* usersWatcher() {
  yield takeLatest(PartnerActionTypes.FETCH_USERS, fetchUsers)
}

export function* partnerSaga() {
  yield all([
    fork(partnerWatcher),
    fork(countriesWatcher),
    fork(statesWatcher),
    fork(paymentTermsWatcher),
    fork(usersWatcher),
  ])
}

// Helpers
const renderEditButton = (id: number) => (
  <Link to={`/partners/details/${id}`} className="btn btn-secondary btn-sm">
    <span className="lnr lnr-pencil" />
  </Link>
)

export const PartnerColumns = [
  { name: 'name', title: 'Nama' },
  { name: 'type', title: 'Tipe' },
  { name: 'email', title: 'Email' },
  { name: 'phone', title: 'Telepon' },
  // { name: 'status', title: 'Status' },
]

const preparePartnerTable = (partners: ResPartner[]) => {
  return partners.map(partner => ({
    name: partner.name,
    type: `${partner.supplier ? 'Supplier' : ''}
      ${partner.supplier && partner.customer ? ' & ' : ''}
      ${partner.customer ? 'Customer' : ''}`,
    email: partner.email,
    phone: partner.phone,
    status: partner.active ? 'Active' : 'Inactive',
    id: partner.id,
  }))
}

const transformChild = (obj: any) => {
  return map(
    cond([
      [
        propEq('type', 'invoice'),
        renameKeys({
          countryId: 'billingCountryId',
          stateId: 'billingStateId',
          street: 'billingStreet',
          city: 'billingCity',
          zip: 'billingZip',
          phone: 'billingPhone',
        }),
      ],
      [
        propEq('type', 'delivery'),
        renameKeys({
          countryId: 'shippingCountryId',
          stateId: 'shippingStateId',
          street: 'shippingStreet',
          city: 'shippingCity',
          zip: 'shippingZip',
          phone: 'shippingPhone',
        }),
      ],
      [T, always],
    ])
  )(obj)
}

const spreadChildToParent = (obj: any) => {
  const { childIds, ...restKeys } = obj
  const defaultSuggestion = {
    label: '',
    value: '',
  }

  const deliveryAddress = ifElse(
    isEmpty,
    always({
      shippingCountryId: defaultSuggestion,
      shippingStateId: defaultSuggestion,
      shippingStreet: '',
      shippingCity: '',
      shippingZip: '',
      shippingPhone: '',
    }),
    pipe(
      find(propEq('type', 'delivery')),
      map(handleNullValue),
      // @ts-ignore
      evolve({
        shippingCountryId: pipe(
          map(handleNullValue),
          renameKeys({
            id: 'value',
            name: 'label',
          })
        ),
        shippingStateId: pipe(
          map(handleNullValue),
          renameKeys({
            id: 'value',
            name: 'label',
          })
        ),
      })
    )
  )(childIds)

  // const deliveryAddress = pipe(
  //   find(propEq('type', 'delivery')),
  //   map(handleNullValue),
  //   // @ts-ignore
  //   evolve({
  //     shippingCountryId: pipe(
  //       map(handleNullValue),
  //       renameKeys({
  //         id: 'value',
  //         name: 'label'
  //       }),
  //     ),
  //     shippingStateId: pipe(
  //       map(handleNullValue),
  //       renameKeys({
  //         id: 'value',
  //         name: 'label'
  //       }),
  //     ),
  //   }),
  // )(childIds)

  const invoiceAddress = ifElse(
    isEmpty,
    always({
      billingCountryId: defaultSuggestion,
      billingStateId: defaultSuggestion,
      billingStreet: '',
      billingCity: '',
      billingZip: '',
      billingPhone: '',
    }),
    pipe(
      find(propEq('type', 'invoice')),
      map(handleNullValue),
      // @ts-ignore
      evolve({
        billingCountryId: pipe(
          map(handleNullValue),
          renameKeys({
            id: 'value',
            name: 'label',
          })
        ),
        billingStateId: pipe(
          map(handleNullValue),
          renameKeys({
            id: 'value',
            name: 'label',
          })
        ),
      })
    )
  )(childIds)

  // const invoiceAddress = pipe(
  //   find(propEq('type', 'invoice')),
  //   map(handleNullValue),
  //   // @ts-ignore
  //   evolve({
  //     billingCountryId: pipe(
  //       map(handleNullValue),
  //       renameKeys({
  //         id: 'value',
  //         name: 'label'
  //       }),
  //     ),
  //     billingStateId: pipe(
  //       map(handleNullValue),
  //       renameKeys({
  //         id: 'value',
  //         name: 'label'
  //       }),
  //     ),
  //   })
  // )(childIds)

  return {
    ...restKeys,
    invoiceAddress,
    deliveryAddress,
  }
}

export const preparePartnerForm = (response: CamelResPartnerSingle) => {
  return pipe(
    map(handleNullValue),
    // @ts-ignore
    evolve({
      childIds: transformChild,
      propertyPaymentTermId: pipe(
        ifElse(
          propEq('id', null),
          always(null),
          renameKeys({
            id: 'value',
            displayName: 'label',
          })
        )
      ),
      propertySupplierPaymentTermId: pipe(
        ifElse(
          propEq('id', null),
          always(null),
          renameKeys({
            id: 'value',
            displayName: 'label',
          })
        )
      ),
      propertyProductPricelist: pipe(
        ifElse(
          propEq('id', null),
          always(null),
          renameKeys({
            id: 'value',
            displayName: 'label',
          })
        )
      ),
    }),
    spreadChildToParent
  )(response as any)
}

const transformPartnerForm = (formValues: PartnerFormVals) => {
  const { invoiceAddress, deliveryAddress } = formValues
  const invoiceChild = pipe(
    renameKeys({
      billingCountryId: 'countryId',
      billingStateId: 'stateId',
      billingCity: 'city',
      billingStreet: 'street',
      billingZip: 'zip',
      billingPhone: 'phone',
    }),
    evolve({
      countryId: prop('value'),
      stateId: prop('value'),
    }),
    assoc('type', 'invoice'),
    assoc('customer', prop('customer', formValues)),
    assoc('supplier', prop('supplier', formValues))
  )(invoiceAddress)

  const deliveryChild = pipe(
    renameKeys({
      shippingCountryId: 'countryId',
      shippingStateId: 'stateId',
      shippingCity: 'city',
      shippingStreet: 'street',
      shippingZip: 'zip',
      shippingPhone: 'phone',
    }),
    evolve({
      countryId: prop('value'),
      stateId: prop('value'),
    }),
    assoc('type', 'delivery'),
    assoc('customer', prop('customer', formValues)),
    assoc('supplier', prop('supplier', formValues))
  )(deliveryAddress)

  return pipe(
    dissoc('invoiceAddress'),
    dissoc('deliveryAddress'),
    assoc('childIds', [invoiceChild, deliveryChild]),
    set(
      lensProp('propertyPaymentTermId'),
      path(['propertyPaymentTermId', 'value'], formValues)
    ),
    set(
      lensProp('propertySupplierPaymentTermId'),
      path(['propertySupplierPaymentTermId', 'value'], formValues)
    ),
    set(lensProp('userId'), path(['userId', 'value'], formValues))
  )(formValues)
}
