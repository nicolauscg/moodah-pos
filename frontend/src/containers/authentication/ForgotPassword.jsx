import React from 'react'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import { authUser } from '../../redux/modules/auth'

import ForgotPassForm from './components/ForgotPassForm'

import Loader from '../../shared/components/Loader'

// const EmailSent = `${process.env.PUBLIC_URL}/img/reset-email-sent.svg`

class ForgotPassword extends React.Component {
  componentDidMount() {
    this.props.authUser()
  }

  render() {
    const { userState } = this.props

    switch (userState.kind) {
      case 'Guest':
        const { forgotPassProcess } = userState

        switch (forgotPassProcess.kind) {
          case 'Init':
            return (
              <div className="account">
                <div className="account__wrapper">
                  <div className="account__card account__forgot">
                    <div className="account__head">
                      <h3 className="account__title">Forgot your password?</h3>
                      <h4 className="account__subhead subhead">
                        Fill your email to reset your password
                      </h4>
                    </div>
                    <ForgotPassForm />
                  </div>
                </div>
              </div>
            )
          case 'Loading':
            return <Loader page />
          case 'Sent':
            return (
              <Redirect to={`/reset_password/${forgotPassProcess.username}`} />
            )
          // return (
          //   <div className='account'>
          //     <div className='account__wrapper message'>
          //       <div className='img-wrapper-sent'>
          //         <img className='w-50' src={EmailSent} alt='email-sent' />
          //       </div>
          //       <h3>Email Sent</h3>
          //       <h5>
          //         We've sent a link to reset your password to your email.
          //         Please follow the description in the email.
          //       </h5>
          //     </div>
          //   </div>
          // )
          default:
            return null
        }
      case 'User':
        return <Redirect to="/partners/list" />
      default:
        return null
    }
  }
}

const mapStateToProps = state => ({
  userState: state.auth.userState,
})

const mapDispatchToProps = dispatch => ({
  authUser: () => dispatch(authUser()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword)
