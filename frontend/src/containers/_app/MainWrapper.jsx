import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { compose, withContext, withPropsOnChange, branch } from 'recompose'
import { pathOr, pipe, path, equals } from 'ramda'
import { compareAsc } from 'date-fns'

import { SidebarProps, ThemeProps } from '../../shared/prop-types/ReducerProps'
import { UserInfo } from '../../generated-models'
import {
  UserInfoContext,
  datetimeFromOdoo,
  getValueOdooSelection,
} from '../../utils/transformers/general'

import NotificationContainer from './NotificationContainer'

class MainWrapper extends Component {
  static propTypes = {
    sidebar: SidebarProps.isRequired,
    theme: ThemeProps.isRequired,
    children: PropTypes.element.isRequired,
  }

  render() {
    const { sidebar, theme } = this.props

    const wrapperClass = classNames({
      wrapper: true,
      'wrapper--full-width': sidebar.collapse,
    })

    return (
      <Fragment>
        <div className={theme.className}>
          <div className={wrapperClass}>{this.props.children}</div>
        </div>
        <NotificationContainer />
      </Fragment>
    )
  }
}

export default compose(
  connect(state => ({
    theme: state.theme,
    sidebar: state.sidebar,
    userState: state.auth.userState,
  })),
  branch(
    ({ userState }) => userState.kind === 'User',
    compose(
      UserInfo.HOC({
        name: 'getUserInfo',
      }),
      withPropsOnChange(['getUserInfo'], ({ getUserInfo }) => {
        let showExpired = false
        let name = ''
        let isStandardPlan = false
        let uid = null

        if (!getUserInfo.loading) {
          const validDate = pathOr(
            null,
            ['sessionInfo', 'companyId', 'validDate'],
            getUserInfo
          )

          if (validDate) {
            const currentDate = new Date()
            const validDateObj = datetimeFromOdoo(validDate)

            if (compareAsc(currentDate, validDateObj) === 1) {
              showExpired = true
            }
          }

          uid = pathOr(null, ['sessionInfo', 'uid'], getUserInfo)
          name = pathOr('', ['sessionInfo', 'name'], getUserInfo)
          isStandardPlan = pipe(
            path(['sessionInfo', 'companyId', 'userPlan']),
            getValueOdooSelection,
            equals('standard')
          )(getUserInfo)
        }

        return { showExpired, name, isStandardPlan, uid }
      }),
      withContext(UserInfoContext, ({ showExpired, uid, name, isStandardPlan }) => ({
        showExpired,
        uid,
        name,
        isStandardPlan,
      }))
    )
  )
)(MainWrapper)
