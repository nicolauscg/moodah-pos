import React from 'react'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import { compose, lifecycle } from 'recompose'

import { Form, FastField } from 'formik'
import { Link, Redirect } from 'react-router-dom'
import { Button } from 'reactstrap'

import {
  authUser,
  logIn,
  processCompletePassword,
} from '../../../redux/modules/auth'

import FormikInput from '../../../shared/components/formik/TextInput'
import withNotif from '../../../shared/components/withNotif'

class LogInForm extends React.Component {
  componentDidMount() {
    this.props.authUser()
  }

  render() {
    const { userState } = this.props

    switch (userState.kind) {
      case 'Guest':
        return <LogInContent {...this.props} />
      case 'User':
        const afterLoginPath = sessionStorage.afterLoginPath || '/partners/list'
        sessionStorage.removeItem('afterLoginPath')
        return <Redirect to={afterLoginPath} />
      case 'CompletePass':
        return <CompletePassForm {...this.props} />
      default:
        return null
    }
  }
}

const LogInContent = compose(
  withFormik({
    mapPropsToValues: () => ({
      username: '',
      password: '',
    }),
    handleSubmit: (values, { props }) => {
      props.logIn(values)
    },
    displayName: 'LogInForm',
    validateOnBlur: false,
    validateOnChange: false,
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { userState, setSubmitting } = this.props
      const { userState: prevUserState } = prevProps

      const { authProcess } = userState
      const { authProcess: prevAuthProcess } = prevUserState

      if (
        userState.kind === 'Guest' &&
        prevUserState.kind === 'Guest' &&
        authProcess.kind !== prevAuthProcess.kind
      ) {
        switch (userState.authProcess.kind) {
          case 'Init':
            break
          case 'Loading':
            break
          case 'Failed':
            setSubmitting(false)
            break
          default:
            break
        }
      }
    },
  })
)(({ isSubmitting }) => {
  return (
    <Form className="material-form">
      <FastField
        label="Username"
        name="username"
        required
        component={FormikInput}
      />
      <FastField
        label="Password"
        name="password"
        type="password"
        required
        component={FormikInput}
      />
      <Link to="forgot_password" className="account__forgot-link">
        Forgot Password?
      </Link>
      <Button
        color="primary"
        className="account__btn account__btn--small"
        type="submit"
        disabled={isSubmitting}
      >
        Sign In
      </Button>
    </Form>
  )
})

const CompletePassForm = compose(
  withNotif,
  withFormik({
    mapPropsToValues: () => ({
      password: '',
      repeatPass: '',
    }),
    handleSubmit: (values, { props }) => {
      if (values.password !== values.repeatPass) {
        props.triggerNotif({
          type: 'warning',
          message: 'Password yang Anda masukkan tidak sama',
        })
      } else {
        props.processCompletePass(props.userState.currUser, values.password)
      }
    },
    displayName: 'CompletePassForm',
    validateOnBlur: false,
    validateOnChange: false,
  })
)(() => {
  return (
    <Form className="material-form">
      <FastField
        label="New Password"
        name="password"
        type="password"
        inputProps={{ minLength: 8 }}
        required
        component={FormikInput}
      />
      <FastField
        label="Confirm New Password"
        name="repeatPass"
        type="password"
        inputProps={{ minLength: 8 }}
        required
        component={FormikInput}
      />
      <Button
        color="primary"
        className="account__btn account__btn--small"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  )
})

const mapStateToProps = state => ({
  userState: state.auth.userState,
})

const mapDispatchToProps = dispatch => ({
  logIn: formValues => dispatch(logIn(formValues)),
  authUser: () => dispatch(authUser()),
  processCompletePass: (currUser, password) =>
    dispatch(processCompletePassword(currUser, password)),
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LogInForm)
