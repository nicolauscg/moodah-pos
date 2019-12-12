import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { Redirect, Link } from 'react-router-dom'

import { resetPassword, requestResetPass } from '../../redux/modules/auth'

import CreatePassForm from './components/CreatePassForm'

import Loader from '../../shared/components/Loader'

const EmailExpired = `${process.env.PUBLIC_URL}/img/reset-email-expired.svg`

class CreatePassword extends React.Component {
  render() {
    const { resetPasswordState, match, userState } = this.props

    // switch (resetPasswordState.kind) {
    //   case 'Init':
    //     return (
    //       <div className="account">
    //         <div className="account__wrapper">
    //           <div className="account__card account__reset">
    //             <div className="account__head">
    //               <h3 className="account__title">Create New Password</h3>
    //               <h4 className="account__subhead subhead">
    //                 Complete your password reset
    //               </h4>
    //             </div>
    //             <CreatePassForm username={match.params.username} />
    //           </div>
    //         </div>
    //       </div>
    //     )
    //   case 'Validating':
    //     return <Loader wholePage />
    //   case 'Invalid':
    //     return (
    //       <div className="account">
    //         <div className="account__wrapper message">
    //           <div className="img-wrapper-expired">
    //             <img src={EmailExpired} alt="email-expired" />
    //           </div>
    //           <h3>Oh bummer!</h3>
    //           <h5>
    //             It seems your link has expired. Please request another one by
    //             clicking the button below.
    //           </h5>
    //           <Link
    //             className="btn btn-outline-primary account__btn account__btn--small mt-5 w-50"
    //             to="/forgot_password"
    //           >
    //             Retry
    //           </Link>
    //         </div>
    //       </div>
    //     )
    //   case 'Redirect':
    //     return <Redirect to="/log_in" />
    //   default:
    //     return null
    // }

    if (resetPasswordState.kind === 'Redirect') {
      return <Redirect to="/log_in" />
    }

    const loadingSubmit = resetPasswordState.kind === 'Validating'
    const loadingResend =
      userState.kind === 'Guest' &&
      userState.forgotPassProcess.kind === 'Loading'
    const isLoading = loadingSubmit || loadingResend

    return (
      <Fragment>
        {isLoading ? <Loader page /> : null}
        <div className={`account ${isLoading ? 'white-overlay' : ''}`}>
          <div className="account__wrapper">
            <div className="account__card account__reset">
              <div className="account__head">
                <h3 className="account__title">Create New Password</h3>
                <h4 className="account__subhead subhead">
                  Complete your password reset
                </h4>
              </div>
              <CreatePassForm
                username={match.params.username}
                loadingSubmit={loadingSubmit}
                loadingReset={loadingResend}
                submit={this.props.resetPassword}
                resend={this.props.requestResetPass}
              />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  userState: state.auth.userState,
  resetPasswordState: state.auth.resetPasswordState,
})

const mapDispatchToProps = dispatch => ({
  resetPassword: formValues => dispatch(resetPassword(formValues)),
  requestResetPass: (formValues, bypass) =>
    dispatch(requestResetPass(formValues, bypass)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePassword)
