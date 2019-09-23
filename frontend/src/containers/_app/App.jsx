import React, { Component } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactGA from 'react-ga'
import { hot } from 'react-hot-loader'
import 'bootstrap/dist/css/bootstrap.css'

import '../../scss/app.scss'
import Router from './Router'

ReactGA.initialize(process.env.REACT_APP_GA_CODE)

class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      loaded: false,
    }
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false })
      setTimeout(() => this.setState({ loaded: true }), 500)
    })
  }

  render() {
    const { loaded, loading } = this.state
    return (
      <div>
        {!loaded && (
          <div className={`load${loading ? '' : ' loaded'}`}>
            <div className="load__icon-wrap">
              <div className="load__gif app">
                <img src="/loading.gif" alt="Loading" />
              </div>
            </div>
          </div>
        )}
        <div>
          <Router />
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
