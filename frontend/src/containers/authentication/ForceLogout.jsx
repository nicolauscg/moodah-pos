import React from 'react'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import { logOut } from '../../redux/modules/auth'

class EmergencyLogout extends React.Component {
  componentDidMount() {
    this.props.logOut()
  }

  render() {
    const { userState } = this.props

    switch (userState.kind) {
      case 'Guest':
        return <Redirect to="/log_in" />
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
  logOut: () => dispatch(logOut()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmergencyLogout)
