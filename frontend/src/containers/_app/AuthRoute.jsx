import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, withHandlers, withContext } from 'recompose'
import { path } from 'ramda'

import { authUser } from '../../redux/modules/auth'
import { showDialog } from '../../redux/modules/general'
import { ErrorHandlerContext } from '../../utils/transformers/general'

class AuthRoute extends React.Component {
  componentDidMount() {
    if (['Validating', 'Guest'].includes(this.props.userState.kind)) {
      const afterLoginPath =
        this.props.location.pathname + this.props.location.search
      sessionStorage.setItem('afterLoginPath', afterLoginPath)
    }

    this.props.authUser()
  }

  render() {
    const {
      component: Component,
      userState,
      addOnInstalled,
      ...rest
    } = this.props

    return (
      <Route
        {...rest}
        render={props => {
          // const token = localStorage.getItem('token')

          // if (token) {
          //   return <Component {...props} />
          // } else {
          //   return (
          //     <Redirect
          //       to={{
          //         pathname: '/log_in',
          //       }}
          //     />
          //   )
          // }
          const componentProps = {
            addOnInstalled,
            ...props,
          }

          switch (userState.kind) {
            case 'Guest':
              return (
                <Redirect
                  to={{
                    pathname: '/log_in',
                  }}
                />
              )
            case 'User':
              return <Component {...componentProps} />
            default:
              return <React.Fragment />
          }
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  userState: state.auth.userState,
})

const mapDispatchToProps = dispatch => ({
  authUser: () => dispatch(authUser()),
  triggerDialog: dialog => dispatch(showDialog(dialog)),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    onError: ({ triggerDialog }) => ({ graphQLErrors, networkError }) => {
      if (graphQLErrors.length) {
        const extensionsError = path(
          [0, 'extensions', 'exception', 'errorMessages'],
          graphQLErrors
        )
        const graphQlMessage = path([0, 'message'], graphQLErrors)
        const message = extensionsError || graphQlMessage

        const startTrimIdx = message.indexOf('(Document')

        triggerDialog({
          title: 'Warning',
          message: startTrimIdx > 0 ? message.substr(0, startTrimIdx) : message,
        })
      }

      if (networkError) console.log(`[Network error]: ${networkError}`)
    },
  }),
  withContext(ErrorHandlerContext, ({ onError }) => ({ onError }))
)(AuthRoute)
