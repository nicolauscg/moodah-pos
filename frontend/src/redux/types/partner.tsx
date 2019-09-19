import { FetchParams, Suggestion } from './general'

// ADTs
interface Fetching {
  kind: 'Fetching',
}

interface Failed {
  kind: 'Failed',
  message: string,
}

interface Success {
  kind: 'Success',
  data: {
    partners: ResPartner[],
    total: number,
  },
}

interface SuccessSingle {
  kind: 'Success',
  data: ResPartner,
}

interface SuccessCountries {
  kind: 'Success',
  data: Suggestion[],
}

interface SuccessStates {
  kind: 'Success',
  data: Suggestion[],
}

interface Draft {
  kind: 'Draft'
}

interface Submit {
  kind: 'Submit'
}

interface SuccessCreate {
  kind: 'Success',
  partnerId: number,
}

interface SuccessPaymentTerm {
  kind: 'Success',
  data: Suggestion[],
}

export type PartnersData = Fetching | Failed | Success

export type PartnerData = Fetching | Failed | SuccessSingle

export type CountriesData = Fetching | Failed | SuccessCountries

export type StatesData = Fetching | Failed | SuccessStates

export type CreatePartner = Draft | Submit | SuccessCreate

export type PaymentTermsData = Fetching | Failed | SuccessPaymentTerm

// Interfaces
interface Address {
  street?: string,
  city?: string,
  stateId?: {
    id: number,
    name: string,
  },
  countryId?: {
    id: number,
    name: string,
    code: string,
  },
  zip?: string,
  phone?: string,
}

export interface ResCountry {
  id: number,
  name: string,
}

export interface ResCountryState {
  id: number,
  name: string,
}

export interface ResPartner {
  id: number,
  name: string,
  customer: boolean,
  supplier: boolean,
  email?: string,
  phone?: string,
  active: boolean,
  type: string,
  user_ids: ResUsers[],
}

export interface CamelResPartner {
  id: number,
  name: string,
  customer: boolean,
  supplier: boolean,
  email?: string,
  phone?: string,
  active: boolean,
  type: string,
  userIds: ResUsers[],
}

export interface ResUsers {
  id: number,
  login: string,
}

export interface ResPartnerChild extends Address {
  id: number,
  type: string,
}

export interface ResPartnerSingle extends ResPartner, Address {
  tin?: string,
  website?: string,
  child_ids: ResPartnerChild[]
}

export interface CamelResPartnerSingle extends CamelResPartner, Address {
  tin?: string,
  website?: string,
  childIds: ResPartnerChild[]
}

export interface AccountPaymentTerm {
  id: number,
  name: string,
}

export interface FetchPartnersResp {
  count: number,
  results: ResPartner[] | object,
  total: number,
}

export interface FetchCountriesResp {
  count: number,
  results: ResCountry[] | object,
  total: number,
}

export interface FetchStatesResp {
  count: number,
  results: ResCountryState[] | object,
  total: number,
}

export interface FetchPaymentTermsResp {
  count: number,
  results: AccountPaymentTerm[] | object,
  total: number,
}

export interface FetchUsersResp {
  count: number,
  results: ResUsers[] | object,
  total: number,
}

export interface PartnerFormVals {
  id: number,
  name: string,
  customer: boolean,
  supplier: boolean,
  email?: string,
  phone?: string,
  invoiceAddress: {
    billingCountryId: Suggestion,
    billingStateId: Suggestion,
    billingCity: string,
    billingZip: string,
    billingPhone: string,
  },
  deliveryAddress: {
    shippingCountryId: Suggestion,
    shippingStateId: Suggestion,
    shippingCity: string,
    shippingZip: string,
    shippingPhone: string,
  },
}

// Reducer Types
export const enum PartnerActionTypes {
  FETCH_PARTNER = '@@partner/FETCH_PARTNER',
  FETCH_PARTNER_SUCCESS = '@@partner/FETCH_PARTNER_SUCCESS',
  FETCH_PARTNER_FAILED = '@@partner/FETCH_PARTNER_FAILED',
  UPDATE_FETCH_PARAMS = '@@partner/UPDATE_FETCH_PARAMS',
  FETCH_SINGLE_PARTNER = '@@partner/FETCH_SINGLE_PARTNER',
  FETCH_SINGLE_PARTNER_SUCCESS = '@@partner/FETCH_SINGLE_PARTNER_SUCCESS',
  FETCH_SINGLE_PARTNER_FAILED = '@@partner/FETCH_PARTNER_SINGLE_FAILED',
  FETCH_COUNTRIES = '@@partner/FETCH_COUNTRIES',
  FETCH_COUNTRIES_SUCCESS = '@@partner/FETCH_COUNTRIES_SUCCESS',
  FETCH_COUNTRIES_FAILED = '@@partner/FETCH_COUNTRIES_FAILED',
  FETCH_BILLING_STATES = '@@partner/FETCH_BILLING_STATES',
  FETCH_BILLING_STATES_SUCCESS = '@@partner/FETCH_BILLING_STATES_SUCCESS',
  FETCH_BILLING_STATES_FAILED = '@@partner/FETCH_BILLING_STATES_FAILED',
  RESET_BILLING_STATES = '@@partner/RESET_BILLING_STATES',
  FETCH_SHIPPING_STATES = '@@partner/FETCH_SHIPPING_STATES',
  FETCH_SHIPPING_STATES_SUCCESS = '@@partner/FETCH_SHIPPING_STATES_SUCCESS',
  FETCH_SHIPPING_STATES_FAILED = '@@partner/FETCH_SHIPPING_STATES_FAILED',
  RESET_SHIPPING_STATES = '@@partner/RESET_SHIPPING_STATES',
  UPDATE_PARTNER = '@@partner/UPDATE_PARTNER',
  CREATE_PARTNER = '@@partner/CREATE_PARTNER',
  CREATE_PARTNER_SUCCESS = '@@partner/CREATE_PARTNER_SUCCESS',
  CREATE_PARTNER_FAILED = '@@partner/CREATE_PARTNER_FAILED',
  RESET_CREATE_PARTNER = '@@partner/RESET_CREATE_PARTNER',
  FETCH_PAYMENT_TERMS = '@@partner/FETCH_PAYMENT_TERMS',
  FETCH_PAYMENT_TERMS_SUCCESS = '@@partner/FETCH_PAYMENT_TERMS_SUCCESS',
  FETCH_PAYMENT_TERMS_FAILED = '@@partner/FETCH_PAYMENT_TERMS_FAILED',
  FETCH_USERS = '@@partner/FETCH_USERS',
  FETCH_USERS_SUCCESS = '@@partner/FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILED = '@@partner/FETCH_USERS_FAILED',
}

export interface PartnerState {
  readonly partnersState: PartnersData,
  readonly partnerParams: FetchParams,
  readonly partnerState: PartnerData,
  readonly countriesState: CountriesData,
  readonly billingStatesState: StatesData,
  readonly shippingStatesState: StatesData,
  readonly createPartnerState: CreatePartner,
  readonly paymentTermsState: PaymentTermsData,
  readonly usersState: PartnersData,
}
