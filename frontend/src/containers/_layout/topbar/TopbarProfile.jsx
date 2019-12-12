import React from 'react'
import { connect } from 'react-redux'
import { compose, getContext } from 'recompose'

import DownIcon from 'mdi-react/ChevronDownIcon'
import { Collapse } from 'reactstrap'

import { logOut } from '../../../redux/modules/auth'
import { UserInfoContext } from '../../../utils/transformers/general'

import TopbarMenuLink from './TopbarMenuLink'

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`

class TopbarProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
      username: null,
    }
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse })
  }

  render() {
    const { name } = this.props

    return (
      <div className="topbar__profile">
        <button className="topbar__avatar" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={Ava} alt="avatar" />
          <p className="topbar__avatar-name">{name}</p>
          <DownIcon className="topbar__icon" />
        </button>
        {this.state.collapse && (
          <button className="topbar__back" onClick={this.toggle} />
        )}
        <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <TopbarMenuLink
              path="/account_settings"
              icon="cog"
              title="Account Settings"
            />
            <div className="topbar__link" onClick={this.props.logOut}>
              <span className="topbar__link-icon lnr lnr-exit" />
              <p className="topbar__link-title">Log Out</p>
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

// const mapStateToProps = (state, ownProps) => ({
//   userProfileState: state.auth.userProfileState,
// })

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  // getUser: () => dispatch(getUser(dispatch)),
})

export default compose(
  getContext(UserInfoContext),
  connect(
    // mapStateToProps,
    null,
    mapDispatchToProps
  )
)(TopbarProfile)
