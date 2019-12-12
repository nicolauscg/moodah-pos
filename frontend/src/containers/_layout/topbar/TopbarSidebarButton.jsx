import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const iconBlack = `${process.env.PUBLIC_URL}/img/burger.svg`
const iconWhite = `${process.env.PUBLIC_URL}/img/hamburger.svg`

class TopbarSidebarButton extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  }

  render() {
    const {
      changeMobileSidebarVisibility,
      changeSidebarVisibility,
      useWhiteBurger,
    } = this.props
    const icon = useWhiteBurger ? iconWhite : iconBlack

    return (
      <div>
        <button
          className={classnames('topbar__button', 'topbar__button--desktop', {
            'topbar__use-logo': !useWhiteBurger,
          })}
          onClick={changeSidebarVisibility}
        >
          <img src={icon} alt="" className="topbar__button-icon" />
        </button>
        <button
          className={classnames('topbar__button', 'topbar__button--mobile', {
            'topbar__use-logo': !useWhiteBurger,
          })}
          onClick={changeMobileSidebarVisibility}
        >
          <img src={icon} alt="" className="topbar__button-icon" />
        </button>
      </div>
    )
  }
}

export default TopbarSidebarButton
