import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'

import LogInForm from './components/LogInForm'

import { authorize } from '../../redux/modules/auth'
import { addNotif } from '../../redux/modules/general'

const LogIn = ({ onSignInError, onSignInSuccess }) => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">
            Welcome to&nbsp;
            <span className="account__logo">Moodah</span>
          </h3>
          <h4 className="account__subhead subhead">
            Start your business easily now
          </h4>
        </div>
        <LogInForm />
      </div>
    </div>
  </div>
)

const enhance = compose(
  connect(
    null,
    dispatch => ({
      authorizeUser: () => dispatch(authorize()),
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
  withHandlers({
    onSignInSuccess: ({ history, authorizeUser }) => ({ signIn }) => {
      localStorage.setItem('accessToken', signIn.sessionToken)
      authorizeUser()
      history.push('/partners/list')
      history.push('/product_category/list')
    },
    onSignInError: ({ triggerNotif }) => ({ networkError }) => {
      const message = networkError
        ? 'Login gagal mohon cek kembali jaringan internet Anda'
        : 'Login gagal cek kembali username dan password Anda'

      triggerNotif({
        message,
        type: 'danger',
      })
    },
  })
)

export default enhance(LogIn)

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
