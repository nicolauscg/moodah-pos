import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const styles = theme => ({
  checked: {
    color: '#4ce1b6',
  },
  label: {
    color: '#646777',
    fontSize: '12px',
  },
  checkbox: {
    '& svg': {
      width: '0.8em',
      height: '0.8em',
    },
  },
})

const FormCheckbox = ({
  CheckboxProps,
  FormLabelProps,
  classes: classesProp,
  noMB,
}) => {
  const getCheckboxClass = ({ checked, root, ...classes } = {}) => ({
    ...classes,
    checked: checked
      ? `${checked} ${classesProp.checked}`
      : classesProp.checked,
    root: root ? `${root} ${classesProp.checkbox}` : classesProp.checkbox,
  })

  const getFormLabelClass = ({ label, ...classes } = {}) => ({
    ...classes,
    label: label ? `${label} ${classesProp.label}` : classesProp.label,
  })

  const getProps = ({ classes, ...props } = {}, component) => {
    if (component === 'checkbox') {
      return {
        ...props,
        classes: getCheckboxClass(classes),
      }
    }

    if (component === 'form_label') {
      return {
        ...props,
        classes: getFormLabelClass(classes),
      }
    }
  }

  const { disabled } = CheckboxProps

  return (
    <FormControlLabel
      className={`material-form__checkbox${noMB ? ' noMB' : ''}${
        disabled ? ' disabled' : ''
      }`}
      control={
        <Checkbox color="default" {...getProps(CheckboxProps, 'checkbox')} />
      }
      {...getProps(FormLabelProps, 'form_label')}
    />
  )
}

FormCheckbox.propTypes = {
  classes: PropTypes.object.isRequired,
  CheckboxProps: PropTypes.object,
  FormLabelProps: PropTypes.object,
  noMB: PropTypes.bool,
}

export default withStyles(styles)(FormCheckbox)
