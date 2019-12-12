import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

import { sidebarReducer, themeReducer } from '../../redux/reducers/index'
import {
  authReducer,
  authSaga,
  partnerReducer,
  partnerSaga,
  generalReducer,
} from '../../redux/modules/index'

let logger = createLogger({
  timestamps: true,
  duration: true,
  collapsed: true,
})

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  auth: authReducer,
  partner: partnerReducer,
  general: generalReducer,
})

function* saga() {
  yield all([fork(authSaga), fork(partnerSaga)])
}

export const sagaMiddleware = createSagaMiddleware()

// sagaMiddleware.run(saga);

function configureStore() {
  const store = createStore(
    reducer,
    compose(applyMiddleware(logger, sagaMiddleware))
  )

  sagaMiddleware.run(saga)

  return store
}

export default configureStore
// export { sagaMiddleware, saga }
