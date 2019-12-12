import React from 'react'
import PropTypes from 'prop-types'

import { Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
// import FA from 'react-fontawesome'

const SidebarLink = ({
  title,
  icon,
  counter,
  newLink,
  route,
  onClick,
  className,
}) => (
  <NavLink
    to={route}
    onClick={onClick}
    activeClassName="sidebar__link-active"
    className={className}
  >
    <li className="sidebar__link">
      {/* icon ? <span className={`sidebar__link-icon lnr lnr-${icon}`} /> : '' */}
      {icon ? (
        // ? <FA
        //   name={icon}
        //   className="sidebar__link-icon"
        // />
        <img
          src={`/img/sidebar_icon/${icon}.svg`}
          alt={icon}
          className="sidebar__link-icon"
        />
      ) : (
        ''
      )}
      <p className="sidebar__link-title">
        {title}
        {newLink ? (
          <Badge className="sidebar__link-badge">
            <span>New</span>
          </Badge>
        ) : (
          ''
        )}
        {counter ? (
          <Badge className="sidebar__link-counter">
            <span>{counter}</span>
          </Badge>
        ) : (
          ''
        )}
      </p>
    </li>
  </NavLink>
)

SidebarLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  newLink: PropTypes.bool,
  counter: PropTypes.number,
  route: PropTypes.string,
  onClick: PropTypes.func,
}

SidebarLink.defaultProps = {
  icon: '',
  newLink: false,
  route: '/',
  onClick: () => {},
}

export default SidebarLink
