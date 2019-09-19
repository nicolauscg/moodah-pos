import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import idLocale from 'date-fns/locale/id'
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import Amplify from 'aws-amplify'
import { connect } from 'react-redux'
import { onError } from 'apollo-link-error'
import { path } from 'ramda'
import { from } from 'apollo-link'

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { CookiesProvider } from 'react-cookie'

import { getAccessToken, logOut } from './redux/modules/auth'

import App from './containers/_app/App'
import configureStore from './containers/_app/store'
import ScrollToTop from './containers/_app/ScrollToTop'

Amplify.configure({
  Auth: {
    region: 'ap-southeast-1',
    userPoolId: process.env.REACT_APP_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
  },
})

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) =>
  getAccessToken().then(token => ({
    headers: {
      ...headers,
      Authorization: token,
    },
  }))
)

const ApolloClientProvider = connect(
  null,
  dispatch => ({
    logOut: () => dispatch(logOut()),
  })
)(
  class extends React.Component {
    componentWillMount() {
      const httpLink = new HttpLink({
        uri: process.env.REACT_APP_GRAPHQL_URL,
      })

      const authLink = setContext((_, { headers }) =>
        getAccessToken().then(token => ({
          headers: {
            ...headers,
            Authorization: token,
          },
        }))
      )

      const errorLink = onError(({ graphQLErrors, _ }) => {
        if (graphQLErrors.length) {
          const extensionsError = path(
            [0, 'extensions', 'exception', 'errorMessages'],
            graphQLErrors
          )
          const graphQlMessage = path([0, 'message'], graphQLErrors)
          const message = extensionsError || graphQlMessage

          if (message && message.includes('Session Expired')) {
            this.props.logOut()
          }
        }
      })

      this._client = new ApolloClient({
        link: from([authLink, errorLink, httpLink]),
        cache: new InMemoryCache({
          dataIdFromObject: result => {
            if (result.__typename === 'ReportLine') {
              if (result.id !== undefined && result.level !== undefined) {
                return `${result.__typename}:${result.id}:${result.level}`
              }
            }

            return defaultDataIdFromObject(result)
          },
        }),
        defaultOptions: {
          query: {
            fetchPolicy: 'network-only',
          },
          watchQuery: {
            fetchPolicy: 'cache-and-network',
          },
        },
      })
    }

    render() {
      return (
        <ApolloProvider client={this._client}>
          {this.props.children}
        </ApolloProvider>
      )
    }
  }
)

export const store = configureStore()

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

render(
  <Provider store={store}>
    <ApolloClientProvider>
      <BrowserRouter>
        <ScrollToTop>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={idLocale}>
            <MuiThemeProvider theme={theme}>
              <CookiesProvider>
                <App />
              </CookiesProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </ScrollToTop>
      </BrowserRouter>
    </ApolloClientProvider>
  </Provider>,
  document.getElementById('root')
)
