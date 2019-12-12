import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import classnames from 'classnames'

import Skeleton from 'react-loading-skeleton'

import { CompanyInfo } from '../../../generated-models'

import TopbarSidebarButton from './TopbarSidebarButton'
import TopbarProfile from './TopbarProfile'

const MoodahLogoPath = `url(${process.env.PUBLIC_URL}/img/moodah_light.png)`

class Topbar extends Component {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  }

  render() {
    const {
      changeMobileSidebarVisibility,
      changeSidebarVisibility,
      getCompanyInfo,
    } = this.props

    const companyLogo = path(
      ['sessionInfo', 'companyId', 'logo'],
      getCompanyInfo
    )
    const backgroundImage =
      !getCompanyInfo.loading && companyLogo
        ? `url(data:image;base64,${companyLogo})`
        : MoodahLogoPath

    const className = classnames({ topbar__sidebar__wrapper: !companyLogo })

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <div className={className}>
              <TopbarSidebarButton
                changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                changeSidebarVisibility={changeSidebarVisibility}
                useWhiteBurger={!companyLogo}
              />
              <div
                className="topbar__logo"
                style={{
                  backgroundImage: getCompanyInfo.loading
                    ? 'unset'
                    : backgroundImage,
                }}
              >
                {getCompanyInfo.loading ? (
                  <Skeleton height="25px" width="90%" />
                ) : null}
              </div>
            </div>
          </div>
          <div className="topbar__right">
            <TopbarProfile />
          </div>
        </div>
      </div>
    )
  }
}

export default CompanyInfo.HOC({ name: 'getCompanyInfo' })(Topbar)
