import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, withState, getContext } from 'recompose'
import { pathOr, prop, mergeDeepLeft } from 'ramda'

import Joyride, { STATUS } from 'react-joyride'

import SidebarLink from './SidebarLink'
import SidebarCategory from './SidebarCategory'
// import Sidebar from './Sidebar'
import mappedMenu from './menu'

import { AvailableMenus } from '../../../generated-models'
import withUserTourCookie from '../../../shared/components/withUserTourCookie'

class SidebarContent extends Component {
  static propTypes = {
    changeToDark: PropTypes.func.isRequired,
    changeToLight: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  state = {
    run: false,
    steps: [
      {
        target: '.settings-menu',
        content: <span>Atur informasi perusahaan Anda disini</span>,
        placement: 'right',
      },
    ],
  }

  componentDidMount() {
    const userTourCookie = this.props.getUserTourCookie()

    if (userTourCookie && pathOr(false, ['sidebar'], userTourCookie)) {
      this.setState({ run: false })
    } else this.setState({ run: true })
  }

  hideSidebar = () => this.props.onClick()

  setHelpers = helpers => (this.helpers = helpers)

  handleJoyrideCallback = ({ status }) => {
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]
    const { cookies } = this.props
    const userId = this.props.getUserId()
    const userTourCookie = this.props.getUserTourCookie()

    if (finishedStatuses.includes(status)) {
      this.setState({ run: false })
      const newUserTourCookie = mergeDeepLeft({ sidebar: true }, userTourCookie)
      cookies.set(userId, newUserTourCookie)
    }
  }

  render() {
    const { openMenu, toggle } = this.props

    const availableMenus =
      [
        {
            action: "",
            children: [],
            id: "",
            name: "Dashboard",
            parentId: "",
            sequence: 1,
            xmlid: "moodah_general_menu.menu_dashboard2",
            __typename: "IrUiMenuType",
        },
        {
            action: "",
            children: [],
            id: "",
            name: "Category",
            parentId: "",
            sequence: 2,
            xmlid: "moodah_general_menu.menu_category",
            __typename: "IrUiMenuType",
        },
        {
            action: "",
            children: [],
            id: "",
            name: "Product",
            parentId: "",
            sequence: 3,
            xmlid: "moodah_general_menu.menu_product",
            __typename: "IrUiMenuType",
        },
        {
            action: "",
            children: [],
            id: "",
            name: "Configuration",
            parentId: "",
            sequence: 4,
            xmlid: "moodah_general_menu.menu_configuration",
            __typename: "IrUiMenuType",
        },
        {
            action: "",
            children: [],
            id: "",
            name: "Mitra",
            parentId: "",
            sequence: 5,
            xmlid: "moodah_general_menu.menu_contacts",
            __typename: "IrUiMenuType",
        },
     ]

    const menus = availableMenus.filter(
      menu =>
        ![
          'moodah_general_menu.menu_settings_root',
          'moodah_general_menu.menu_dashboard',
          'moodah_general_menu.menu_dashboard_intelligence',
        ].includes(menu.xmlid)
    )

    const menuProps = {
      openMenu,
      toggle,
      menus: menus || [],
      level: 0,
    }

    return (
      <div className="sidebar__content">
        {/* <ul className="sidebar__block">
          <SidebarLink title="Log In" icon="exit" route="/log_in" onClick={this.hideSidebar} />
          <SidebarCategory title="Layout" icon="layers">
            <button className="sidebar__link" onClick={this.props.changeToLight}>
              <p className="sidebar__link-title">Light Theme</p>
            </button>
            <button className="sidebar__link" onClick={this.props.changeToDark}>
              <p className="sidebar__link-title">Dark Theme</p>
            </button>
          </SidebarCategory>
        </ul> */}
        {!this.props.noTourGuide && (
          <Fragment>
            <Joyride
              steps={this.state.steps}
              styles={{ options: { zIndex: 1200 } }}
              disableOverlayClose
              showSkipButton
              getHelpers={this.setHelpers}
              spotlightClicks
              callback={this.handleJoyrideCallback}
              run={this.state.run}
            />
          </Fragment>
        )}
        <ul className="sidebar__block">
          <Menus {...menuProps} />
        </ul>
      </div>
    )
  }
}

function Menus({ menus, ...props }) {
  return menus.map((menu, idx) => {
    return <Menu key={idx} {...menu} {...props} />
  })
}

function Menu({ quotation, rfq, openMenu, level, toggle, ...props }) {
  const hasChildren = props.children ? props.children.length : false
  const menu = mappedMenu[props.xmlid]

  if (!menu) return null

  if (hasChildren) {
    const menuProps = {
      openMenu,
      quotation,
      rfq,
      toggle,
      level: level + 1,
    }

    return (
      <SidebarCategory
        title={props.name}
        icon={menu.icon}
        toggle={() => toggle(props.name, level)}
        openMenu={openMenu}
        key={props.id}
      >
        <Menus menus={props.children} {...menuProps} />
      </SidebarCategory>
    )
  } else {
    const counter = menu.counter ? props[menu.counter] : undefined

    return (
      <SidebarLink
        key={props.id}
        title={props.name}
        route={menu.route}
        icon={menu.icon}
        counter={counter}
      />
    )
  }
}

Menu.defaultProps = {
  children: [],
}

const composer = compose(
  withState('openMenuLevel', 'setOpenMenuLevel', 0),
  withState('openMenu', 'setOpenMenu', []),
  AvailableMenus.HOC({
    name: 'availableMenus',
    options: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
  }),
  withHandlers({
    toggle: ({ openMenu, setOpenMenu }) => (menuName, level) => {
      const slicedMenu = openMenu.slice(0, level)

      if (openMenu[level] !== menuName) {
        slicedMenu[level] = menuName
      }

      setOpenMenu(slicedMenu)
    },
  }),
  withUserTourCookie
)

export default composer(SidebarContent)
