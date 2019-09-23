import {} from 'aws-amplify'

// ADTs
interface Init {
  kind: 'Init'
}

interface Loading {
  kind: 'Loading'
}

interface Failed {
  kind: 'Failed'
}

interface Sent {
  kind: 'Sent'
  username: string
}

type AuthProcess = Init | Loading | Failed

type ForgotPassProcess = Init | Loading | Sent | Failed

type CompletePassProcess = Init | Loading | Redirect | Failed

interface Validating {
  kind: 'Validating'
}

interface Guest {
  kind: 'Guest'
  authProcess: AuthProcess
  forgotPassProcess: ForgotPassProcess
}

interface CompletePass {
  kind: 'CompletePass'
  completePassProcess: CompletePassProcess
  currUser: any
}

interface User {
  kind: 'User'
  userId: string
}

interface Valid {
  kind: 'Valid'
  id: number
  partnerId: number
}

interface Invalid {
  kind: 'Invalid'
}

interface Redirect {
  kind: 'Redirect'
}

interface Fetching {
  kind: 'Fetching'
}

interface Success {
  kind: 'Success'
  data: ResUsers
}

interface Failed {
  kind: 'Failed'
}

interface Init {
  kind: 'Init'
}

export type Authentication = Validating | Guest | User | CompletePass

export type ResetPassword = Init | Validating | Valid | Invalid | Redirect

type UserData = Fetching | Success | Failed

// Misc. Types
export type LogInFormValues = {
  username: string
  password: string
}

export type SuccessResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
  company_id: number
  uid: number
  user_context: object
}

export type FailedResponse = {
  error: string
  error_descrip: string
}

export type ForgotPassFormValues = {
  email: string
  db: string
}

export type ResetPassFormValues = {
  username: string
  code: string
  password: string
  passwordRepeat: string
}

export type TransResetPassFormValues = {
  username: string
  code: string
  password: string
}

export type ResUsers = {
  id: number
  name: string
}

// Reducer Types
export const enum AuthActionTypes {
  LOG_IN = '@@auth/LOG_IN',
  LOG_IN_SUCCESS = '@@auth/LOG_IN_SUCCESS',
  LOG_IN_FAILED = '@@auth/LOG_IN_FAILED',
  LOG_OUT = '@@auth/LOG_OUT',
  AUTHENTICATE = '@@auth/AUTHENTICATE',
  AUTHORIZED = '@@auth/AUTHORIZED',
  UNAUTHORIZED = '@@auth/UNAUTHORIZED',
  REQUEST_RESET_PASSWORD = '@@auth/REQUEST_RESET_PASSWORD',
  REQUEST_RESET_PASSWORD_SUCCESS = '@@auth/REQUEST_RESET_PASSWORD_SUCCESS',
  VALIDATE_RESET_TOKEN = '@@auth/VALIDATE_RESET_TOKEN',
  RESET_TOKEN_VALID = '@@auth/RESET_TOKEN_VALID',
  RESET_TOKEN_INVALID = '@@auth/RESET_TOKEN_INVALID',
  RESET_PASSWORD = '@@auth/RESET_PASSWORD',
  RESET_PASSWORD_SUCCESS = '@@auth/RESET_PASSWORD_SUCCESS',
  FETCH_USER = '@@auth/FETCH_USER',
  FETCH_USER_SUCCESS = '@@auth/FETCH_USER_SUCCESS',
  COMPLETE_PASSWORD = '@@auth/COMPLETE_PASSWORD',
  PROCESS_COMPLETE_PASS = '@@auth/PROCESS_COMPLETE_PASS',
}

export interface AuthState {
  readonly userState: Authentication
  readonly resetPasswordState: ResetPassword
  readonly userProfileState: UserData
}
