import React from 'react'
import PropTypes from 'prop-types'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

const ButtonDropdownComponent = props => {
  const { title, color, size, menuItems, ...rest } = props

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        className="icon icon-right"
        color={color}
        size={size}
        {...rest}
      >
        <p>
          {title} <KeyboardArrowDown />
        </p>
      </DropdownToggle>
      <DropdownMenu className="dropdown__menu">
        {renderMenuItems(menuItems)}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

const renderMenuItems = menuItems => {
  return menuItems.map((items, idx) => {
    const { action, label } = items

    return (
      <DropdownItem key={idx} onClick={action}>
        {label}
      </DropdownItem>
    )
  })
}

ButtonDropdownComponent.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    })
  ),
}

ButtonDropdownComponent.defaultProps = {
  color: 'primary',
  size: 'md',
}

export default ButtonDropdownComponent
