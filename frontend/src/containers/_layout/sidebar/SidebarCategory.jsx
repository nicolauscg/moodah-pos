import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Collapse } from 'reactstrap'
// import FA from 'react-fontawesome'

export default class SidebarCategory extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    isNew: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element).isRequired,
      PropTypes.element.isRequired
    ])
  }

  static defaultProps = {
    icon: '',
    isNew: false
  }

  constructor () {
    super()
    // this.state = {
    //   collapse: false
    // }
  }

  // toggle = () => {
  //   this.setState({ collapse: !this.state.collapse })
  // }

  render () {
    const { title, icon, isNew, children, toggle, openMenu } = this.props

    const categoryClass = classNames({
      'sidebar__category-wrap': true,
      'sidebar__category-wrap--open': openMenu.indexOf(title) > -1
    })

    return (
      <div className={categoryClass}>
        <button className='sidebar__link sidebar__category' onClick={toggle}>
          {/* icon ? <span className={`sidebar__link-icon lnr lnr-${icon}`} /> : '' */}
          {icon ? (
            // ? <FA
            //   name={icon}
            //   className="sidebar__link-icon"
            // />
            <img
              src={`/img/sidebar_icon/${icon}.svg`}
              alt={icon}
              className='sidebar__link-icon'
            />
          ) : (
            ''
          )}
          <p className='sidebar__link-title'>
            {title}
            {isNew && <span className='sidebar__category-new' />}
          </p>
          <span className='sidebar__category-icon lnr lnr-chevron-right' />
        </button>
        <Collapse
          isOpen={openMenu.indexOf(title) > -1}
          className='sidebar__submenu-wrap'
        >
          <ul className='sidebar__submenu'>
            <div>{children}</div>
          </ul>
        </Collapse>
      </div>
    )
  }
}
