import { Reducer, Dispatch, Action } from 'redux'
import { action as actionCreate, ActionType } from 'typesafe-actions'
import { call, put, fork, all, takeLatest } from 'redux-saga/effects'
import { pipe, dissoc } from 'ramda'
import { camelizeKeys } from 'humps'
import { Auth } from 'aws-amplify'
import ReactGA from 'react-ga'

// @ts-ignore
import api from '../../utils/api'
import {
  AuthState,
  AuthActionTypes,
  LogInFormValues,
  ForgotPassFormValues,
  ResetPassFormValues,
  SuccessResponse,
  FailedResponse,
  TransResetPassFormValues,
  ResUsers,
} from '../types/auth'
import { addNotif } from './general'
import formatFilters from '../../utils/formatFilters'

// Reducer
const initialState: AuthState = {
  userState: {
    kind: 'Validating',
  },
  resetPasswordState: {
    kind: 'Init',
  },
  userProfileState: {
    kind: 'Fetching',
  },
}

export const authReducer: Reducer<AuthState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case AuthActionTypes.LOG_IN:
      return {
        ...state,
        userState: {
          kind: 'Guest',
          authProcess: {
            kind: 'Loading',
          },
          forgotPassProcess: {
            kind: 'Init',
          },
        },
      }
    case AuthActionTypes.LOG_IN_SUCCESS:
      return {
        ...state,
        userState: {
          kind: 'User',
          userId: action.payload,
        },
      }
    case AuthActionTypes.LOG_IN_FAILED:
      return {
        ...state,
        userState: {
          kind: 'Guest',
          authProcess: {
            kind: 'Failed',
          },
          forgotPassProcess: {
            kind: 'Init',
          },
        },
      }
    case AuthActionTypes.COMPLETE_PASSWORD:
      return {
        ...state,
        userState: {
          kind: 'CompletePass',
          completePassProcess: {
            kind: 'Init',
          },
          currUser: action.payload,
        },
      }
    case AuthActionTypes.AUTHENTICATE:
      return state
    case AuthActionTypes.AUTHORIZED:
      return {
        ...state,
        userState: {
          kind: 'User',
          userId: action.payload,
        },
      }
    case AuthActionTypes.UNAUTHORIZED:
      return {
        ...state,
        userState: {
          kind: 'Guest',
          authProcess: {
            kind: 'Init',
          },
          forgotPassProcess: {
            kind: 'Init',
          },
        },
      }
    case AuthActionTypes.REQUEST_RESET_PASSWORD:
      return {
        ...state,
        userState: {
          kind: 'Guest',
          authProcess: {
            kind: 'Init',
          },
          forgotPassProcess: {
            kind: 'Loading',
          },
        },
      }
    case AuthActionTypes.REQUEST_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        userState: {
          kind: 'Guest',
          authProcess: {
            kind: 'Init',
          },
          forgotPassProcess: {
            kind: 'Sent',
            username: action.payload,
          },
        },
      }
    case AuthActionTypes.VALIDATE_RESET_TOKEN:
      return {
        ...state,
        resetPasswordState: {
          kind: 'Validating',
        },
      }
    case AuthActionTypes.RESET_TOKEN_VALID:
      return {
        ...state,
        resetPasswordState: {
          kind: 'Valid',
          id: action.payload.id,
          partnerId: action.payload.partnerId,
        },
      }
    case AuthActionTypes.RESET_TOKEN_INVALID:
      return {
        ...state,
        resetPasswordState: {
          kind: 'Invalid',
        },
      }
    case AuthActionTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordState: {
          kind: 'Redirect',
        },
      }
    case AuthActionTypes.FETCH_USER:
      return {
        ...state,
        userProfileState: {
          kind: 'Fetching',
        },
      }
    case AuthActionTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        userProfileState: {
          kind: 'Success',
          data: action.payload,
        },
      }
    default:
      return state
  }
}

// Actions
export const logIn = (formValues: LogInFormValues) =>
  actionCreate(AuthActionTypes.LOG_IN, formValues)

const loginSuccess = (userId: string) =>
  actionCreate(AuthActionTypes.LOG_IN_SUCCESS, userId)

const loginFailed = () => actionCreate(AuthActionTypes.LOG_IN_FAILED)

export const authUser = () => actionCreate(AuthActionTypes.AUTHENTICATE)

export const authorize = (userId: string) =>
  actionCreate(AuthActionTypes.AUTHORIZED, userId)

export const unauthorize = () => actionCreate(AuthActionTypes.UNAUTHORIZED)

export const logOut = () => actionCreate(AuthActionTypes.LOG_OUT)

export const requestResetPass = (
  resetForm: ForgotPassFormValues,
  bypass: boolean
) => {
  const { email } = resetForm

  return actionCreate(AuthActionTypes.REQUEST_RESET_PASSWORD, email, bypass)
}

export const validateToken = (token: string, db: string) => {
  return actionCreate(AuthActionTypes.VALIDATE_RESET_TOKEN, token, db)
}

const validToken = (id: number, partnerId: number) => {
  return actionCreate(AuthActionTypes.RESET_TOKEN_VALID, { id, partnerId })
}

const invalidToken = () => actionCreate(AuthActionTypes.RESET_TOKEN_INVALID)

export const resetPassword = (formValues: ResetPassFormValues) => {
  const transformedValues = prepareResetPassword(
    formValues
  ) as TransResetPassFormValues

  return actionCreate(AuthActionTypes.RESET_PASSWORD, transformedValues)
}

const resetPasswordSuccess = () =>
  actionCreate(AuthActionTypes.RESET_PASSWORD_SUCCESS)

export const getUser = (dispatch: Dispatch) => {
  return actionCreate(AuthActionTypes.FETCH_USER, null, dispatch)
}

const getUserSuccess = (response: ResUsers) => {
  return actionCreate(AuthActionTypes.FETCH_USER_SUCCESS, response)
}

const startCompletePassword = (currUser: any) =>
  actionCreate(AuthActionTypes.COMPLETE_PASSWORD, currUser)

export const processCompletePassword = (currUser: any, password: string) =>
  actionCreate(AuthActionTypes.PROCESS_COMPLETE_PASS, { currUser, password })

// Sagas
function* processLogIn(action: ActionType<typeof logIn>) {
  try {
    const { username, password } = action.payload

    const user = yield Auth.signIn(username, password)

    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      yield put(startCompletePassword(user))
    } else {
      const currentSession = yield Auth.currentSession()
      const userId = currentSession.accessToken.payload.username
      yield put(loginSuccess(userId))
    }
  } catch (error) {
    yield put(loginFailed())

    switch (error.code) {
      default:
        console.log(error)
        break
      case 'NotAuthorizedException':
        if (error.message.includes('disabled')) {
          yield put(
            addNotif({
              message: 'User tidak aktif. Silakan gunakan user lain.',
              type: 'danger',
            })
          )
        } else {
          yield put(
            addNotif({
              message: 'Password yang Anda masukkan salah',
              type: 'danger',
            })
          )
        }
        break
      case 'UserNotFoundException':
        yield put(
          addNotif({
            message: 'Username tidak ditemukan',
            type: 'danger',
          })
        )
        break
    }
  }
}

function* processLogOut() {
  yield Auth.signOut()
  yield put(unauthorize())
}

function* authenticate(action: ActionType<typeof authUser>) {
  const token = yield call(getAccessToken)

  if (token) {
    const currentSession = yield Auth.currentSession()
    const userId = currentSession.accessToken.payload.username
    ReactGA.set({ userId })
    yield put(authorize(userId))
  } else {
    yield put(unauthorize())
  }
}

function* requestResetPassServer(action: ActionType<typeof requestResetPass>) {
  try {
    yield Auth.forgotPassword(action.payload)

    yield put(
      addNotif({
        message: 'Kode berhasil dikirim. Silakan cek Email Anda.',
        type: 'success',
      })
    )
    yield put(
      actionCreate(
        AuthActionTypes.REQUEST_RESET_PASSWORD_SUCCESS,
        action.payload
      )
    )
  } catch (error) {
    yield put(
      addNotif({
        message: 'Error!',
        type: 'danger',
      })
    )
  }
}

function* validateResetToken(action: ActionType<typeof validateToken>) {
  try {
    const { uid, access_token: AccessToken } = yield call(
      api.post,
      '/auth/get_tokens',
      JSON.stringify({
        db: action.meta,
        username: 'admin',
        password: 'password',
      })
    )

    try {
      const { login } = yield call(
        api.put,
        `/res.partner/${uid}/signup_retrieve_info`,
        JSON.stringify({
          token: action.payload,
        }),
        { 'Access-Token': AccessToken }
      )

      try {
        const filters = yield call(formatFilters, [
          { field: 'login', operator: '=', comparator: login },
        ])

        const { results } = yield call(
          api.get,
          '/res.users',
          {
            filters,
            limit: 1,
          },
          { 'Access-Token': AccessToken }
        )

        yield put(validToken(results[0].id, results[0].partner_id))
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      yield put(invalidToken())
    }
  } catch (error) {
    console.log(error)
  }
}

function* resetPasswordServer(action: ActionType<typeof resetPassword>) {
  try {
    const { username, code, password } = action.payload
    yield Auth.forgotPasswordSubmit(username, code, password)

    yield put(resetPasswordSuccess())
    yield put(
      addNotif({
        message: 'Password berhasil diubah',
        type: 'success',
      })
    )
  } catch (error) {
    switch (error.code) {
      default:
        console.log(error)
        break
      case 'CodeMismatchException':
        yield put(
          addNotif({
            message: 'Kode yang Anda masukkan salah',
            type: 'danger',
          })
        )
        break
      case 'UserNotFoundException':
        yield put(
          addNotif({
            message: 'Username tidak ditemukan',
            type: 'danger',
          })
        )
        break
    }
  }
}

function* logInWatcher() {
  yield takeLatest(AuthActionTypes.LOG_IN, processLogIn)
}

function* logOutWatcher() {
  yield takeLatest(AuthActionTypes.LOG_OUT, processLogOut)
}

function* authenticateWatcher() {
  yield takeLatest(AuthActionTypes.AUTHENTICATE, authenticate)
}

function* resetPasswordWatcher() {
  yield [
    takeLatest(AuthActionTypes.REQUEST_RESET_PASSWORD, requestResetPassServer),
    takeLatest(AuthActionTypes.VALIDATE_RESET_TOKEN, validateResetToken),
    takeLatest(AuthActionTypes.RESET_PASSWORD, resetPasswordServer),
  ]
}

function* fetchUser(action: ActionType<typeof getUser>) {
  try {
    const token = yield call(getAccessToken)
    const id = yield call(getUserId)

    const response = yield call(
      api.get,
      `/res.users/${id}`,
      undefined,
      { 'Access-Token': token },
      action.meta
    )

    const camelizedResp: ResUsers = yield call(camelizeKeys, response)

    yield put(getUserSuccess(camelizedResp))
  } catch (error) {
    console.log(error)
  }
}

function* userWatcher() {
  yield takeLatest(AuthActionTypes.FETCH_USER, fetchUser)
}

function* finishCompletePass(
  action: ActionType<typeof processCompletePassword>
) {
  try {
    const { currUser, password } = action.payload
    yield Auth.completeNewPassword(currUser, password, {})

    // refresh current user's token
    const authUser = yield Auth.currentAuthenticatedUser()
    const currentSession = yield Auth.currentSession()
    const userId = currentSession.accessToken.payload.username

    authUser.refreshSession(currentSession.refreshToken)

    yield put(loginSuccess(userId))
  } catch (error) {
    console.log(error)
  }
}

function* completePasswordWatcher() {
  yield takeLatest(AuthActionTypes.PROCESS_COMPLETE_PASS, finishCompletePass)
}

export function* authSaga() {
  yield all([
    fork(logInWatcher),
    fork(logOutWatcher),
    fork(authenticateWatcher),
    fork(resetPasswordWatcher),
    fork(userWatcher),
    fork(completePasswordWatcher),
  ])
}

// Side Effects Services
// const getAccessToken = () => localStorage.getItem('accessToken')
export const getAccessToken = async () => {
  try {
    const session = await Auth.currentSession()
    return session.getIdToken().getJwtToken()
  } catch (error) {
    return false
  }
}

export const getOdooToken = async () => {
  try {
    const session = await Auth.currentSession()
    return session.getIdToken().payload['custom:sessionToken']
  } catch (error) {
    return false
  }
}

const getRefreshToken = () => localStorage.getItem('refreshToken')

const getUserId = () => localStorage.getItem('id')

const checkAccessToken = () => {
  const accessExpire = localStorage.getItem('accessExpire')
  const expirationDate = accessExpire ? new Date(accessExpire) : new Date()
  const today = new Date()

  if (today > expirationDate) {
    const refreshExpire = localStorage.getItem('refreshExpire')
    const refreshExpirationDate = refreshExpire
      ? new Date(refreshExpire)
      : new Date()

    return today < refreshExpirationDate
  }

  return false
}

const setAccessToken = (
  accessToken: string,
  refreshToken: string,
  uid: number
) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('accessExpire', getIncreasedDate(EXPIRES_IN))
  localStorage.setItem('refreshExpire', getIncreasedDate(REFRESH_EXPIRES_IN))
  localStorage.setItem('id', uid.toString())
}

const clearAccessToken = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessExpire')
  localStorage.removeItem('refreshExpire')
  localStorage.removeItem('id')
}

const prepareFetchUser = (email: string, token: string) => {
  const filters = formatFilters([
    { field: 'login', operator: '=', comparator: email },
  ])

  const headers = {
    'Access-Token': token,
  }

  return {
    params: {
      filters,
    },
    headers,
  }
}

const prepareResetPassword = (formValues: ResetPassFormValues) => {
  return pipe(dissoc('passwordRepeat'))(formValues)
}

// Misc.
const EXPIRES_IN = 600
const REFRESH_EXPIRES_IN = 7200

const getIncreasedDate = (increase: number) => {
  let baseDate = new Date()
  baseDate.setSeconds(baseDate.getSeconds() + increase)

  return baseDate.toString()
}
