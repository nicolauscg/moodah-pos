import React from 'react'
import { dissoc } from 'ramda'

import FormCheckbox from '../form-custom/FormCheckbox'

export default function Checkbox(props) {
  const {
    field: { value, ...restField },
    form,
    CheckboxProps,
    ...restProps
  } = props

  const onChange = (e, checked) => {
    restField.onChange(e, checked)
    if (CheckboxProps && CheckboxProps.onChange) {
      CheckboxProps.onChange(e, checked)
    }
  }

  return (
    <FormCheckbox
      CheckboxProps={{
        ...dissoc('onChange', CheckboxProps),
        ...dissoc('onChange', restField),
        checked: value,
        onChange,
      }}
      {...restProps}
    />
  )
}
